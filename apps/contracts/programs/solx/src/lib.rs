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
pub use decimal_correction::*;
pub use event::*;

declare_id!("8jbXs1fR9Bm5dh7N6Dr4ySsZWEeHeKTgsTYFjL386bcN");

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

  pub fn purchase(ctx: Context<PurchaseListing>, id: u64) -> Result<()> {
    purchase::handle(ctx, id)
  }

  pub fn create_listing(
    ctx: Context<CreateListing>,
    id: u64,
    name: String,
    symbol: String,
    uri: String,
    collateral_amount: u64,
    price_amount: u64
  ) -> Result<()> {
    create_listing::handle(
      ctx,
      id,
      name,
      symbol,
      uri,
      collateral_amount,
      price_amount
    )
  }

  pub fn initiate_dispute(
    ctx: Context<InitiateDispute>,
    id: u64
  ) -> Result<()> {
    initiate_dispute::handle(ctx, id)
  }

  pub fn resolve_dispute(
    ctx: Context<ResolveDispute>,
    id: u64,
    verdict: Verdict
  ) -> Result<()> {
    resolve_dispute::handle(ctx, id, verdict)
  }

  pub fn close_listing(ctx: Context<CloseListing>, id: u64) -> Result<()> {
    close_listing::handle(ctx, id)
  }
}
