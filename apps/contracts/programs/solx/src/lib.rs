pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;
pub mod utils;
pub mod decimal_correction;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;
pub use utils::*;
pub use decimal_correction::*;
declare_id!("5nCJ7xpgDfsSpcnbpRZf8WadzyxwShFoK8FRrVfYcSJ5");

#[program]
pub mod solx {
  use super::*;

  pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
    initialize::handler(ctx)
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
}
