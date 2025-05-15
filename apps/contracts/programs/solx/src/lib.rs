pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;
pub mod utils;
pub mod decimal_correction;
pub mod event;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;
pub use utils::*;
pub use event::*;
pub use decimal_correction::*;

declare_id!("72GoG8mDsCuBMBSQZe3TmXtgQgNxuAzCh4ipgyRJqGCi");

#[program]
pub mod solx {
  use super::*;

  pub fn initialize(
    ctx: Context<Initialize>,
    authority: Pubkey,
    operator: Pubkey,
    treasury: Pubkey,
    fee: u64
  ) -> Result<()> {
    initialize::handler(ctx, authority, operator, treasury, fee)
  }

  pub fn purchase(ctx: Context<PurchaseListing>, id: [u8; 16]) -> Result<()> {
    purchase::handle(ctx, id)
  }

  pub fn create_listing(
    ctx: Context<CreateListing>,
    id: [u8; 16],
    collateral_amount: u64,
    price_amount: u64
  ) -> Result<()> {
    create_listing::handle_create_listing(
      ctx,
      id,
      collateral_amount,
      price_amount
    )
  }

  pub fn mint_nft(
    ctx: Context<MintNft>,
    id: [u8; 16],
    name: String,
    symbol: String,
    uri: String
  ) -> Result<()> {
    create_listing::handle_mint_nft(ctx, id, name, symbol, uri)
  }

  pub fn initiate_dispute(
    ctx: Context<InitiateDispute>,
    id: [u8; 16]
  ) -> Result<()> {
    initiate_dispute::handle(ctx, id)
  }

  pub fn resolve_dispute(
    ctx: Context<ResolveDispute>,
    id: [u8; 16],
    verdict: Verdict
  ) -> Result<()> {
    resolve_dispute::handle(ctx, id, verdict)
  }

  pub fn close_listing(ctx: Context<CloseListing>, id: [u8; 16]) -> Result<()> {
    close_listing::handle(ctx, id)
  }

  pub fn whitelist(
    ctx: Context<Whitelist>,
    mint: Pubkey,
    whitelisted: bool
  ) -> Result<()> {
    whitelist::handle(ctx, mint, whitelisted)
  }

  pub fn update_mint(
    ctx: Context<UpdateMint>,
    payment_mint: Pubkey,
    feed: String
  ) -> Result<()> {
    update_mint::handle(ctx, payment_mint, feed)
  }
}
