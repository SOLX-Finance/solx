use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum ListingState {
  Open,
  Purchased,
  Resolved,
  Cancelled,
}

#[account]
#[derive(InitSpace)]
pub struct Listing {
  pub nft: Pubkey,
  pub collateral_amount: u64,
  pub price_usd: u64,
  pub state: ListingState,
  pub expiry_ts: u64,
  pub buyer: Pubkey,
}

impl Listing {
  pub const SEED: &'static [u8; 7] = b"listing";
}
