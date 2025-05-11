use anchor_lang::prelude::*;

use anchor_spl::token::{ transfer, Mint, Token, TokenAccount, Transfer };

use anchor_spl::token_2022::Token2022;
use anchor_spl::token_interface::{
  Mint as MintTrait,
  TokenAccount as TokenAccountTrait,
};

use crate::error::SolxError;
use crate::{
  seeds,
  GlobalState,
  Listing,
  ListingState,
  WhitelistedState,
  PERCENTAGE_SCALE,
};

#[derive(Accounts)]
#[instruction(id: u64)]
pub struct CloseListing<'info> {
  #[account(mut)]
  pub authority: Signer<'info>,

  #[account(mut)]
  pub payer: Signer<'info>,

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
      mut,
      constraint = listing_collateral_mint_account.mint.key().eq(&collateral_mint.key()) @ SolxError::InvalidCollateralMint,
      constraint = listing_collateral_mint_account.owner.key().eq(&listing.key()) @ SolxError::Forbidden,
  )]
  pub listing_collateral_mint_account: Box<
    InterfaceAccount<'info, TokenAccountTrait>
  >,

  #[account(
      mut,
      constraint = listing_payment_mint_account.mint.key().eq(&payment_mint.as_ref().unwrap().key()) @ SolxError::InvalidPaymentMint,
      constraint = listing_payment_mint_account.owner.key().eq(&listing.key()) @ SolxError::Forbidden,
  )]
  pub listing_payment_mint_account: Box<
    InterfaceAccount<'info, TokenAccountTrait>
  >,

  #[account(
      mut,
      constraint = authority_collateral_mint_account.mint.key().eq(&collateral_mint.key()) @ SolxError::InvalidCollateralMint,
      constraint = authority_collateral_mint_account.owner.key().eq(&authority.key()) @ SolxError::Forbidden,
  )]
  pub authority_collateral_mint_account: Box<
    InterfaceAccount<'info, TokenAccountTrait>
  >,

  #[account(
      mut,
      constraint = authority_payment_mint_account.mint.key().eq(&payment_mint.as_ref().unwrap().key()) @ SolxError::InvalidPaymentMint,
      constraint = authority_payment_mint_account.owner.key().eq(&authority.key()) @ SolxError::Forbidden,
  )]
  pub authority_payment_mint_account: Option<
    Box<InterfaceAccount<'info, TokenAccountTrait>>
  >,

  #[account(
      mut,
      constraint =  treasury_payment_mint_account.mint.eq(&payment_mint.as_ref().unwrap().key()) @ SolxError::InvalidMint,
      constraint = treasury_payment_mint_account.owner.eq(&global_state.treasury) @ SolxError::InvalidTreasury
  )]
  pub treasury_payment_mint_account: Option<
    Box<InterfaceAccount<'info, TokenAccountTrait>>
  >,

  #[account(
    mut,
    constraint = collateral_mint.key().eq(&listing.collateral_mint) @ SolxError::InvalidCollateralMint,
    constraint = collateral_whitelisted_state.whitelisted.eq(&true) @ SolxError::MintNotWhitelisted
  )]
  pub collateral_mint: Box<InterfaceAccount<'info, MintTrait>>,

  #[account(
    mut,
    constraint = payment_mint.key().eq(&listing.payment_mint) @ SolxError::InvalidPaymentMint,
    constraint = payment_whitelisted_state.as_ref().unwrap().whitelisted.eq(&true) @ SolxError::MintNotWhitelisted
  )]
  pub payment_mint: Option<Box<InterfaceAccount<'info, MintTrait>>>,

  #[account(
    mut,
    seeds = [WhitelistedState::PAYMENT_MINT_SEED, collateral_mint.key().as_ref()],
    bump
  )]
  pub collateral_whitelisted_state: Account<'info, WhitelistedState>,

  #[account(
    mut,
    seeds = [WhitelistedState::PAYMENT_MINT_SEED, payment_mint.as_ref().unwrap().key().as_ref()],
    bump
  )]
  pub payment_whitelisted_state: Option<Account<'info, WhitelistedState>>,

  #[account(
    mut,
    seeds = [
      seeds::MINT_SEED,
      global_state.key().as_ref(),
      id.to_le_bytes().as_ref(),
    ],
    bump
  )]
  pub nft_mint: Account<'info, Mint>,

  #[account(
    mut,
    constraint = nft_token_account.owner.eq(&authority.key()),
    constraint = nft_token_account.mint.eq(&nft_mint.key())
  )]
  pub nft_token_account: Account<'info, TokenAccount>,

  pub system_program: Program<'info, System>,

  pub token_program: Program<'info, Token>,

  pub token_program_2022: Program<'info, Token2022>,

  pub rent: Sysvar<'info, Rent>,
}

pub fn handle(ctx: Context<CloseListing>, id: u64) -> Result<()> {
  let accounts = ctx.accounts;

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

  let open_or_purchased =
    accounts.listing.state == ListingState::Opened ||
    accounts.listing.state == ListingState::Purchased;

  require!(open_or_purchased, SolxError::InvalidState);

  if open_or_purchased {
    transfer(
      CpiContext::new_with_signer(
        if
          accounts.collateral_mint
            .to_account_info()
            .owner.eq(&accounts.token_program.key())
        {
          accounts.token_program.to_account_info()
        } else {
          accounts.token_program_2022.to_account_info()
        },
        Transfer {
          from: accounts.listing_collateral_mint_account.to_account_info(),
          to: accounts.authority_collateral_mint_account.to_account_info(),
          authority: accounts.listing.to_account_info(),
        },
        listing_seeds
      ),
      accounts.listing.collateral_amount
    )?;
  }

  if accounts.listing.state == ListingState::Purchased {
    let fee = accounts.global_state.fee;

    let fee_amount = accounts.listing.payment_amount
      .checked_mul(fee)
      .unwrap()
      .checked_div(PERCENTAGE_SCALE)
      .unwrap();

    let amount_to_transfer = accounts.listing.payment_amount
      .checked_sub(fee_amount)
      .unwrap();

    transfer(
      CpiContext::new_with_signer(
        if
          accounts.collateral_mint
            .to_account_info()
            .owner.eq(&accounts.token_program.key())
        {
          accounts.token_program.to_account_info()
        } else {
          accounts.token_program_2022.to_account_info()
        },
        Transfer {
          from: accounts.listing_payment_mint_account.to_account_info(),
          to: accounts.authority_payment_mint_account
            .as_ref()
            .unwrap()
            .to_account_info(),
          authority: accounts.listing.to_account_info(),
        },
        listing_seeds
      ),
      amount_to_transfer
    )?;

    transfer(
      CpiContext::new_with_signer(
        if
          accounts.collateral_mint
            .to_account_info()
            .owner.eq(&accounts.token_program.key())
        {
          accounts.token_program.to_account_info()
        } else {
          accounts.token_program_2022.to_account_info()
        },
        Transfer {
          from: accounts.listing_payment_mint_account.to_account_info(),
          to: accounts.treasury_payment_mint_account
            .as_ref()
            .unwrap()
            .to_account_info(),
          authority: accounts.listing.to_account_info(),
        },
        listing_seeds
      ),
      fee_amount
    )?;
  }

  Ok(())
}
