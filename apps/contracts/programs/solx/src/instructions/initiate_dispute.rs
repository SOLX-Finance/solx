use anchor_lang::prelude::*;
use anchor_spl::token::{
  freeze_account,
  FreezeAccount,
  Mint,
  Token,
  TokenAccount,
};

use crate::{
  bytes_to_uuid,
  error::SolxError,
  get_timestamp,
  seeds,
  Dispute,
  GlobalState,
  Listing,
  ListingDisputed,
  ListingState,
};

#[derive(Accounts)]
#[instruction(id: [u8; 16])]
pub struct InitiateDispute<'info> {
  #[account(
    mut,
    constraint = initiator.key().eq(&listing.buyer) || initiator.key().eq(&nft_token_account.owner) @ SolxError::InvalidInitiator
  )]
  pub initiator: Signer<'info>,

  #[account(mut)]
  pub global_state: Account<'info, GlobalState>,

  #[account(
    mut,
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
    init,
    payer = initiator,
    space = 8 + Dispute::INIT_SPACE,
    seeds = [b"dispute", global_state.key().as_ref(), listing.key().as_ref()],
    bump
  )]
  pub dispute: Account<'info, Dispute>,

  pub system_program: Program<'info, System>,

  pub token_program: Program<'info, Token>,
}

pub fn handle(ctx: Context<InitiateDispute>, id: [u8; 16]) -> Result<()> {
  let listing = &ctx.accounts.listing;
  require!(listing.state == ListingState::Purchased, SolxError::InvalidState);

  let now = get_timestamp()?;

  require!(now.lt(&listing.expiry_ts), SolxError::Expired);

  let dispute = &mut ctx.accounts.dispute;

  dispute.initiator = ctx.accounts.initiator.key();

  let global_state_key = ctx.accounts.global_state.key();
  let nft_mint = ctx.accounts.nft_mint.key();

  let listing_seeds: &[&[&[u8]]] = &[
    &[
      Listing::SEED,
      global_state_key.as_ref(),
      nft_mint.as_ref(),
      &[ctx.bumps.listing],
    ],
  ];

  freeze_account(
    CpiContext::new_with_signer(
      ctx.accounts.token_program.to_account_info(),
      FreezeAccount {
        account: ctx.accounts.nft_token_account.to_account_info(),
        mint: ctx.accounts.nft_mint.to_account_info(),
        authority: listing.to_account_info(),
      },
      listing_seeds
    )
  )?;

  emit!(ListingDisputed {
    id: bytes_to_uuid(id),
    global_state: ctx.accounts.global_state.key(),
    listing: ctx.accounts.listing.key(),
    nft: ctx.accounts.nft_mint.key(),
    initiator: ctx.accounts.initiator.key(),
  });

  Ok(())
}
