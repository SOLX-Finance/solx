use anchor_lang::prelude::*;
use anchor_spl::{
  token::{
    freeze_account,
    thaw_account,
    transfer,
    FreezeAccount,
    Mint,
    ThawAccount,
    Token,
    TokenAccount,
    Transfer,
  },
  token_2022::Token2022,
  token_interface::{ Mint as MintTrait, TokenAccount as TokenAccountTrait },
};

use crate::{
  bytes_to_uuid,
  error::SolxError,
  reset_listing,
  seeds,
  Dispute,
  DisputeResolved,
  GlobalState,
  Listing,
  ListingState,
  Verdict,
  WhitelistedState,
};

#[derive(Accounts)]
#[instruction(id: [u8; 16])]
pub struct ResolveDispute<'info> {
  #[account(
    mut,
    constraint = admin.key().eq(&global_state.operator) @ SolxError::Forbidden
  )]
  pub admin: Signer<'info>,

  #[account(mut)]
  pub global_state: Account<'info, GlobalState>,

  #[account(
    mut,
    seeds = [b"dispute", global_state.key().as_ref(), listing.key().as_ref()],
    bump
  )]
  pub dispute: Account<'info, Dispute>,

  #[account(
    mut,
    constraint = listing.state == ListingState::Disputed @ SolxError::InvalidState,
    seeds = [
      Listing::SEED,
      global_state.key().as_ref(),
      nft_mint.key().as_ref(),
    ],
    bump
  )]
  pub listing: Account<'info, Listing>,

  #[account(
    seeds = [seeds::MINT_SEED, global_state.key().as_ref(), id.as_ref()],
    bump
  )]
  pub nft_mint: Account<'info, Mint>,

  #[account(
    mut,
    constraint = nft_token_account.mint.eq(&nft_mint.key())
  )]
  pub nft_token_account: Account<'info, TokenAccount>,

  #[account(
      mut,
      constraint =  listing_payment_mint_account.mint.eq(&payment_mint.key()) @ SolxError::InvalidMint,
      constraint = listing_payment_mint_account.owner.eq(&listing.key()) @ SolxError::InvalidBuyer
  )]
  pub listing_payment_mint_account: Box<
    InterfaceAccount<'info, TokenAccountTrait>
  >,

  #[account(
      mut,
      constraint =  listing_collateral_mint_account.mint.eq(&collateral_mint.key()) @ SolxError::InvalidMint,
      constraint = listing_collateral_mint_account.owner.eq(&listing.key()) @ SolxError::InvalidSeller
  )]
  pub listing_collateral_mint_account: Box<
    InterfaceAccount<'info, TokenAccountTrait>
  >,

  #[account(
      mut,
      constraint =  buyer_payment_mint_account.mint.eq(&payment_mint.key()) @ SolxError::InvalidMint,
      constraint = buyer_payment_mint_account.owner.eq(&listing.buyer) @ SolxError::InvalidBuyer
  )]
  pub buyer_payment_mint_account: Box<
    InterfaceAccount<'info, TokenAccountTrait>
  >,

  #[account(
      mut,
      constraint =  seller_collateral_mint_account.mint.eq(&collateral_mint.key()) @ SolxError::InvalidMint,
      constraint = seller_collateral_mint_account.owner.eq(&nft_token_account.owner) @ SolxError::InvalidSeller
  )]
  pub seller_collateral_mint_account: Box<
    InterfaceAccount<'info, TokenAccountTrait>
  >,

  #[account(
      mut,
      constraint =  treasury_payment_mint_account.mint.eq(&payment_mint.key()) @ SolxError::InvalidMint,
      constraint = treasury_payment_mint_account.owner.eq(&global_state.treasury) @ SolxError::InvalidTreasury
  )]
  pub treasury_payment_mint_account: Box<
    InterfaceAccount<'info, TokenAccountTrait>
  >,

  #[account(
      mut,
      constraint =  treasury_collateral_mint_account.mint.eq(&collateral_mint.key()) @ SolxError::InvalidMint,
      constraint = treasury_collateral_mint_account.owner.eq(&global_state.treasury) @ SolxError::InvalidTreasury
  )]
  pub treasury_collateral_mint_account: Box<
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
  pub payment_mint_state: Account<'info, WhitelistedState>,

  #[account(
    seeds = [
      WhitelistedState::PAYMENT_MINT_SEED,
      global_state.key().as_ref(),
      collateral_mint.key().as_ref(),
    ],
    bump
  )]
  pub collateral_mint_state: Account<'info, WhitelistedState>,

  #[account(
    mut,
    constraint = payment_mint_state.whitelisted.eq(&true) @ SolxError::MintNotWhitelisted,
    constraint = payment_mint.key().eq(&listing.payment_mint) @ SolxError::InvalidPaymentMint
  )]
  pub payment_mint: Box<InterfaceAccount<'info, MintTrait>>,

  #[account(
    mut,
    constraint = collateral_mint_state.whitelisted.eq(&true) @ SolxError::MintNotWhitelisted,
    constraint = collateral_mint.key().eq(&listing.collateral_mint) @ SolxError::InvalidCollateralMint
  )]
  pub collateral_mint: Box<InterfaceAccount<'info, MintTrait>>,

  pub token_program: Program<'info, Token>,

  pub token_program_2022: Program<'info, Token2022>,

  pub system_program: Program<'info, System>,
}

pub fn handle(
  ctx: Context<ResolveDispute>,
  id: [u8; 16],
  verdict: Verdict
) -> Result<()> {
  let accounts = ctx.accounts;

  require!(
    accounts.listing.state == ListingState::Disputed,
    SolxError::InvalidState
  );

  let global_state_key = accounts.global_state.key();
  let nft_mint = accounts.nft_mint.key();

  let listing_seeds: &[&[&[u8]]] = &[
    &[
      Listing::SEED,
      global_state_key.as_ref(),
      nft_mint.as_ref(),
      &[ctx.bumps.listing],
    ],
  ];

  let listing = &mut accounts.listing;

  let id = bytes_to_uuid(id);

  match verdict {
    Verdict::BuyerFault => {
      transfer(
        CpiContext::new_with_signer(
          if
            accounts.payment_mint.to_account_info().owner ==
            accounts.token_program.key
          {
            accounts.token_program.to_account_info()
          } else {
            accounts.token_program_2022.to_account_info()
          },
          Transfer {
            from: accounts.listing_payment_mint_account.to_account_info(),
            to: accounts.treasury_payment_mint_account.to_account_info(),
            authority: listing.to_account_info(),
          },
          listing_seeds
        ),
        listing.payment_amount
      )?;

      reset_listing(listing);

      emit!(DisputeResolved {
        id,
        global_state: accounts.global_state.key(),
        listing: listing.key(),
        nft: nft_mint.key(),
        verdict,
      });
    }
    Verdict::SellerFault => {
      transfer(
        CpiContext::new_with_signer(
          if
            accounts.collateral_mint.to_account_info().owner ==
            accounts.token_program.key
          {
            accounts.token_program.to_account_info()
          } else {
            accounts.token_program_2022.to_account_info()
          },
          Transfer {
            from: accounts.listing_collateral_mint_account.to_account_info(),
            to: accounts.treasury_collateral_mint_account.to_account_info(),
            authority: listing.to_account_info(),
          },
          listing_seeds
        ),
        listing.collateral_amount
      )?;

      transfer(
        CpiContext::new_with_signer(
          if
            accounts.payment_mint.to_account_info().owner ==
            accounts.token_program.key
          {
            accounts.token_program.to_account_info()
          } else {
            accounts.token_program_2022.to_account_info()
          },
          Transfer {
            from: accounts.listing_payment_mint_account.to_account_info(),
            to: accounts.buyer_payment_mint_account.to_account_info(),
            authority: listing.to_account_info(),
          },
          listing_seeds
        ),
        listing.payment_amount
      )?;

      listing.state = ListingState::Banned;

      emit!(DisputeResolved {
        id,
        global_state: accounts.global_state.key(),
        listing: listing.key(),
        nft: nft_mint.key(),
        verdict,
      });
    }

    Verdict::Refund => {
      transfer(
        CpiContext::new_with_signer(
          if
            accounts.payment_mint.to_account_info().owner ==
            accounts.token_program.key
          {
            accounts.token_program.to_account_info()
          } else {
            accounts.token_program_2022.to_account_info()
          },
          Transfer {
            from: accounts.listing_payment_mint_account.to_account_info(),
            to: accounts.buyer_payment_mint_account.to_account_info(),
            authority: listing.to_account_info(),
          },
          listing_seeds
        ),
        listing.payment_amount
      )?;

      reset_listing(listing);

      thaw_account(
        CpiContext::new_with_signer(
          accounts.token_program.to_account_info(),
          ThawAccount {
            account: accounts.nft_token_account.to_account_info(),
            mint: accounts.nft_mint.to_account_info(),
            authority: listing.to_account_info(),
          },
          listing_seeds
        )
      )?;

      emit!(DisputeResolved {
        id,
        global_state: accounts.global_state.key(),
        listing: listing.key(),
        nft: nft_mint.key(),
        verdict,
      });
    }
  }

  Ok(())
}
