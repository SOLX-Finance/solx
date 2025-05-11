use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum ListingState {
  Opened,
  Purchased,
  Disputed,
  Banned,
}

#[account]
#[derive(InitSpace)]
pub struct Listing {
  pub nft: Pubkey,
  pub buyer: Pubkey,
  pub collateral_mint: Pubkey,
  pub payment_mint: Pubkey,

  pub collateral_amount: u64,
  pub payment_amount: u64,
  pub price_usd: u64,
  pub expiry_ts: u64,

  pub state: ListingState,
}

impl Listing {
  pub const SEED: &'static [u8; 7] = b"listing";
}
