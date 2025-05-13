use anchor_lang::prelude::*;

use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::metadata::{
  create_master_edition_v3,
  create_metadata_accounts_v3,
  CreateMasterEditionV3,
  CreateMetadataAccountsV3,
  Metadata,
};

use anchor_spl::token::Transfer;
use anchor_spl::{
  token_interface::{ Mint, TokenAccount, mint_to, MintTo },
  token::Token,
  token,
};

use mpl_token_metadata::types::DataV2;

use crate::error::SolxError;
use crate::{
  bytes_to_uuid,
  seeds,
  send_sol,
  wsol,
  GlobalState,
  Listing,
  ListingCreated,
  ListingState,
  WhitelistedState,
};

#[derive(Accounts)]
#[instruction(id: [u8; 16])]
pub struct MintNft<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(mut)]
  pub lister: Signer<'info>,

  #[account(mut)]
  pub global_state: Box<Account<'info, GlobalState>>,

  #[account(mut,seeds = [seeds::VAULT_SEED, global_state.key().as_ref()], bump)]
  /// CHECK:
  pub vault: AccountInfo<'info>,

  #[account(address = global_state.authority)]
  /// CHECK:
  pub global_state_authority: AccountInfo<'info>,

  #[account(
    init,
    payer = payer,
    mint::decimals = 0,
    mint::authority = vault,
    mint::freeze_authority = vault,
    seeds = [seeds::MINT_SEED, global_state.key().as_ref(), id.as_ref()],
    bump
  )]
  pub nft_mint: Box<InterfaceAccount<'info, Mint>>,

  #[account(
    init,
    payer = payer,
    associated_token::mint = nft_mint,
    associated_token::authority = lister
  )]
  pub nft_token_account: Box<InterfaceAccount<'info, TokenAccount>>,

  #[account(
      mut,
      seeds = [
        seeds::METADATA_SEED,
        metadata_program.key().as_ref(),
        nft_mint.key().as_ref(),
        seeds::EDITION_SEED,
      ],
      bump,
      seeds::program = metadata_program.key()
    )]
  /// CHECK:
  pub master_edition_account: UncheckedAccount<'info>,

  #[account(
    mut,
    seeds = [seeds::METADATA_SEED, metadata_program.key().as_ref(), nft_mint.key().as_ref()], 
    bump,
    seeds::program = metadata_program.key()
  )]
  /// CHECK:
  pub nft_metadata: UncheckedAccount<'info>,

  pub metadata_program: Program<'info, Metadata>,
  pub associated_token_program: Program<'info, AssociatedToken>,
  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token>,
  pub rent: Sysvar<'info, Rent>,
}

pub fn handle_mint_nft(
  ctx: Context<MintNft>,
  id: [u8; 16],
  name: String,
  symbol: String,
  uri: String
) -> Result<()> {
  let global_state_key = ctx.accounts.global_state.key();

  let vault_seeds: &[&[&[u8]]] = &[
    &[seeds::VAULT_SEED, global_state_key.as_ref(), &[ctx.bumps.vault]],
  ];

  mint_to(
    CpiContext::new_with_signer(
      ctx.accounts.token_program.to_account_info(),
      MintTo {
        authority: ctx.accounts.vault.to_account_info(),
        to: ctx.accounts.nft_token_account.to_account_info(),
        mint: ctx.accounts.nft_mint.to_account_info(),
      },
      vault_seeds
    ),
    1
  )?;

  create_metadata_accounts_v3(
    CpiContext::new_with_signer(
      ctx.accounts.metadata_program.to_account_info(),
      CreateMetadataAccountsV3 {
        payer: ctx.accounts.payer.to_account_info(),
        mint: ctx.accounts.nft_mint.to_account_info(),
        metadata: ctx.accounts.nft_metadata.to_account_info(),
        mint_authority: ctx.accounts.vault.to_account_info(),
        update_authority: ctx.accounts.global_state_authority.to_account_info(),
        system_program: ctx.accounts.system_program.to_account_info(),
        rent: ctx.accounts.rent.to_account_info(),
      },
      vault_seeds
    ),
    DataV2 {
      name,
      symbol,
      uri,
      seller_fee_basis_points: 0,
      creators: None,
      collection: None,
      uses: None,
    },
    true,
    true,
    None
  )?;

  create_master_edition_v3(
    CpiContext::new_with_signer(
      ctx.accounts.metadata_program.to_account_info(),
      CreateMasterEditionV3 {
        edition: ctx.accounts.master_edition_account.to_account_info(),
        payer: ctx.accounts.payer.to_account_info(),
        mint: ctx.accounts.nft_mint.to_account_info(),
        metadata: ctx.accounts.nft_metadata.to_account_info(),
        mint_authority: ctx.accounts.vault.to_account_info(),
        update_authority: ctx.accounts.global_state_authority.to_account_info(),
        system_program: ctx.accounts.system_program.to_account_info(),
        token_program: ctx.accounts.token_program.to_account_info(),
        rent: ctx.accounts.rent.to_account_info(),
      },
      vault_seeds
    ),
    Some(1)
  )?;

  Ok(())
}

#[derive(Accounts)]
#[instruction(id: [u8; 16])]
pub struct CreateListing<'info> {
  #[account(mut)]
  pub lister: Signer<'info>,

  #[account(mut)]
  pub global_state: Box<Account<'info, GlobalState>>,

  #[account(
    init,
    payer = lister,
    space = 8 + Listing::INIT_SPACE,
    seeds = [
      Listing::SEED,
      global_state.key().as_ref(),
      nft_mint.key().as_ref(),
    ],
    bump
  )]
  pub listing: Account<'info, Listing>,

  #[account(mut)]
  pub collateral_mint: Box<InterfaceAccount<'info, Mint>>,

  #[account(
    mut,
    constraint = listing_collateral_mint_account.mint.key().eq(&collateral_mint.key()) @ SolxError::InvalidCollateralMint,
    constraint = listing_collateral_mint_account.owner.key().eq(&listing.key()) @ SolxError::Forbidden,
  )]
  pub listing_collateral_mint_account: Option<
    Box<InterfaceAccount<'info, TokenAccount>>
  >,

  #[account(
    mut,
    constraint = lister_collateral_mint_account.mint.key().eq(&collateral_mint.key()) @ SolxError::InvalidCollateralMint,
    constraint = lister_collateral_mint_account.owner.key().eq(&lister.key()) @ SolxError::Forbidden,
  )]
  pub lister_collateral_mint_account: Option<
    Box<InterfaceAccount<'info, TokenAccount>>
  >,

  #[account(
    mut,
    seeds = [
      WhitelistedState::PAYMENT_MINT_SEED,
      global_state.key().as_ref(),
      collateral_mint.key().as_ref()
    ],
    bump,
    constraint = whitelisted_state.whitelisted.eq(&true) @ SolxError::MintNotWhitelisted
  )]
  pub whitelisted_state: Box<Account<'info, WhitelistedState>>,

  #[account(
    constraint = nft_token_account.mint.key().eq(&nft_mint.key()) @ SolxError::InvalidNftMint,
    constraint = nft_token_account.owner.key().eq(&lister.key()) @ SolxError::Forbidden,
  )]
  pub nft_token_account: Box<InterfaceAccount<'info, TokenAccount>>,

  #[account(
    seeds = [seeds::MINT_SEED, global_state.key().as_ref(), id.as_ref()],
    bump
  )]
  pub nft_mint: Box<InterfaceAccount<'info, Mint>>,

  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token>,
}

pub fn handle_create_listing(
  ctx: Context<CreateListing>,
  id: [u8; 16],
  collateral_amount: u64,
  price_amount: u64
) -> Result<()> {
  if ctx.accounts.collateral_mint.key() != wsol::ID {
    let cpi_ctx = CpiContext::new(
      ctx.accounts.token_program.to_account_info(),
      Transfer {
        from: ctx.accounts.lister_collateral_mint_account
          .as_ref()
          .unwrap()
          .to_account_info(),
        to: ctx.accounts.listing_collateral_mint_account
          .as_ref()
          .unwrap()
          .to_account_info(),
        authority: ctx.accounts.lister.to_account_info(),
      }
    );
    token::transfer(cpi_ctx, collateral_amount)?;
  } else {
    send_sol(
      &ctx.accounts.system_program.to_account_info(),
      &ctx.accounts.lister.to_account_info(),
      &ctx.accounts.listing.to_account_info(),
      collateral_amount,
      None
    )?;
  }

  let listing = &mut ctx.accounts.listing;

  listing.collateral_amount = collateral_amount;
  listing.collateral_mint = ctx.accounts.collateral_mint.key();
  listing.price_usd = price_amount;
  listing.nft = ctx.accounts.nft_mint.key();
  listing.state = ListingState::Opened;

  emit!(ListingCreated {
    id: bytes_to_uuid(id),
    global_state: ctx.accounts.global_state.key(),
    listing: listing.key(),
    nft: ctx.accounts.nft_mint.key(),
    buyer: ctx.accounts.lister.key(),
    collateral_mint: ctx.accounts.collateral_mint.key(),
    collateral_amount,
    price_usd: price_amount,
  });

  Ok(())
}
