use anchor_lang::{ prelude::* };
use anchor_spl::{
  token::{ self, transfer, Token, Transfer },
  token_interface::{ Mint as MintTrait, TokenAccount as TokenAccountTrait },
};
use pyth_solana_receiver_sdk::price_update::PriceUpdateV2;

use crate::{
  error::SolxError,
  get_currency,
  get_timestamp,
  DecimalsCorrection,
  GlobalState,
  Listing,
  ListingState,
  PaymentMintState,
  WhitelistedState,
  DISPUTE_PERIOD_SECS,
};

#[derive(Accounts)]
#[instruction(id: u64)]
pub struct PurchaseListing<'info> {
  #[account(mut)]
  pub buyer: Signer<'info>,

  #[account(mut)]
  pub global_state: Account<'info, GlobalState>,

  #[account(mut,  seeds = [
      Listing::SEED,
      global_state.key().as_ref(),
      id.to_le_bytes().as_ref(),
    ],
    bump)]
  pub listing: Account<'info, Listing>,

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
    seeds = [WhitelistedState::PAYMENT_MINT_SEED, payment_mint.key().as_ref()],
    bump
  )]
  pub whitelisted_state: Account<'info, WhitelistedState>,

  #[account(
    seeds = [PaymentMintState::SEED, payment_mint.key().as_ref()],
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
}

pub fn handle(ctx: Context<PurchaseListing>, id: u64) -> Result<()> {
  let accounts = ctx.accounts;

  let listing = &mut accounts.listing;

  require!(listing.state == ListingState::Open, SolxError::InvalidState);

  let payment_mint_currency = get_currency(
    &accounts.price_update,
    accounts.payment_mint_state.feed.clone()
  )?;

  let listing_price = listing.price_usd;

  let to_pay_amount = payment_mint_currency.0
    .checked_mul(listing_price)
    .unwrap()
    .checked_div((10u64).pow(payment_mint_currency.1))
    .unwrap();

  let cpi_ctx = CpiContext::new(
    accounts.token_program.to_account_info(),
    Transfer {
      from: accounts.buyer_payment_mint_account.to_account_info(),
      to: accounts.listing_payment_mint_account.to_account_info(),
      authority: accounts.buyer.to_account_info(),
    }
  );
  transfer(cpi_ctx, to_pay_amount)?;

  let now = get_timestamp()?;

  listing.expiry_ts = now.checked_add(DISPUTE_PERIOD_SECS).unwrap();

  listing.buyer = accounts.buyer.key();

  listing.state = ListingState::Purchased;

  Ok(())
}
