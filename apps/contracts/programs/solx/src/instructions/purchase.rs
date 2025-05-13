use anchor_lang::{ prelude::* };
use anchor_spl::{
  token::{ self, transfer, Mint, Token, Transfer },
  token_2022::Token2022,
  token_interface::{ Mint as MintTrait, TokenAccount as TokenAccountTrait },
};
use pyth_solana_receiver_sdk::price_update::PriceUpdateV2;

use crate::{
  bytes_to_uuid,
  error::SolxError,
  get_currency,
  get_timestamp,
  seeds,
  send_sol,
  wsol,
  DecimalsCorrection,
  GlobalState,
  Listing,
  ListingPurchased,
  ListingState,
  PaymentMintState,
  WhitelistedState,
  DISPUTE_PERIOD_SECS,
  PERCENTAGE_SCALE,
  PRICE_SCALE,
};

#[derive(Accounts)]
#[instruction(id: [u8; 16])]
pub struct PurchaseListing<'info> {
  #[account(mut)]
  pub buyer: Signer<'info>,

  #[account(mut)]
  pub global_state: Account<'info, GlobalState>,

  #[account(mut,  seeds = [
      Listing::SEED,
      global_state.key().as_ref(),
      nft_mint.key().as_ref(),
    ],
    bump)]
  pub listing: Account<'info, Listing>,

  #[account(
    seeds = [seeds::MINT_SEED, global_state.key().as_ref(), id.as_ref()],
    bump
  )]
  pub nft_mint: Account<'info, Mint>,

  #[account(
      mut,
      associated_token::mint = payment_mint,
      associated_token::authority = listing,
  )]
  pub listing_payment_mint_account: Box<
    InterfaceAccount<'info, TokenAccountTrait>
  >,

  #[account(
      mut,
      associated_token::mint = payment_mint,
      associated_token::authority = buyer,
  )]
  pub buyer_payment_mint_account: Box<
    InterfaceAccount<'info, TokenAccountTrait>
  >,

  #[account(
    mut,
    seeds = [
      WhitelistedState::PAYMENT_MINT_SEED,
      global_state.key().as_ref(),
      payment_mint.key().as_ref(),
    ],
    bump
  )]
  pub whitelisted_state: Account<'info, WhitelistedState>,

  #[account(
    seeds = [
      PaymentMintState::SEED,
      global_state.key().as_ref(),
      payment_mint.key().as_ref(),
    ],
    bump
  )]
  pub payment_mint_state: Account<'info, PaymentMintState>,

  #[account(
    mut,
    constraint = whitelisted_state.whitelisted.eq(&true) @ SolxError::MintNotWhitelisted
  )]
  pub payment_mint: Box<InterfaceAccount<'info, MintTrait>>,

  pub price_update: Account<'info, PriceUpdateV2>,

  pub system_program: Program<'info, System>,

  pub token_program: Program<'info, Token>,

  pub token_program_2022: Program<'info, Token2022>,
}

pub fn handle(ctx: Context<PurchaseListing>, id: [u8; 16]) -> Result<()> {
  let accounts = ctx.accounts;

  let listing = &mut accounts.listing;

  require!(listing.state == ListingState::Opened, SolxError::InvalidState);

  let payment_mint_currency = get_currency(
    &accounts.price_update,
    accounts.payment_mint_state.feed.clone()
  )?;

  let currency_base9 = DecimalsCorrection::convert_to_base9(
    payment_mint_currency.0 as u128,
    payment_mint_currency.1 as u8
  ).unwrap();

  let listing_price = listing.price_usd;

  let to_pay_amount = u128
    ::from(listing_price)
    .checked_mul(PRICE_SCALE as u128)
    .unwrap()
    .checked_div(currency_base9 as u128)
    .unwrap();

  let to_pay_amount_in_mint_dec = DecimalsCorrection::convert_from_base9(
    to_pay_amount,
    accounts.payment_mint.decimals
  ).unwrap() as u64;

  if accounts.payment_mint.key() != wsol::ID {
    require!(
      to_pay_amount_in_mint_dec.le(&accounts.buyer_payment_mint_account.amount),
      SolxError::InsufficientBalance
    );

    let cpi_ctx = CpiContext::new(
      if
        accounts.buyer_payment_mint_account.to_account_info().owner ==
        accounts.token_program.key
      {
        accounts.token_program.to_account_info()
      } else {
        accounts.token_program_2022.to_account_info()
      },
      Transfer {
        from: accounts.buyer_payment_mint_account.to_account_info(),
        to: accounts.listing_payment_mint_account.to_account_info(),
        authority: accounts.buyer.to_account_info(),
      }
    );
    transfer(cpi_ctx, to_pay_amount_in_mint_dec)?;
  } else {
    require!(
      to_pay_amount_in_mint_dec.le(&accounts.buyer.lamports()),
      SolxError::InsufficientBalance
    );

    send_sol(
      &accounts.system_program,
      &accounts.buyer,
      &listing.to_account_info(),
      to_pay_amount_in_mint_dec,
      None
    )?;
  }

  let now = get_timestamp()?;

  listing.expiry_ts = now.checked_add(DISPUTE_PERIOD_SECS).unwrap();
  listing.buyer = accounts.buyer.key();
  listing.payment_amount = to_pay_amount_in_mint_dec;
  listing.payment_mint = accounts.payment_mint.key();
  listing.state = ListingState::Purchased;

  emit!(ListingPurchased {
    id: bytes_to_uuid(id),
    global_state: accounts.global_state.key(),
    listing: listing.key(),
    nft: accounts.nft_mint.key(),
    buyer: accounts.buyer.key(),
    payment_mint: accounts.payment_mint.key(),
    payment_amount: to_pay_amount_in_mint_dec,
    dispute_period_expiry_ts: listing.expiry_ts,
  });

  Ok(())
}
