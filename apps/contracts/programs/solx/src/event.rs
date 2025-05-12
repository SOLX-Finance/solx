use anchor_lang::prelude::*;

use crate::Verdict;

#[event]
pub struct Initialized {
  pub global_state: Pubkey,
  pub authority: Pubkey,
  pub operator: Pubkey,
  pub treasury: Pubkey,
  pub fee: u64,
}

#[event]
pub struct ListingCreated {
  pub global_state: Pubkey,
  pub listing: Pubkey,
  pub nft: Pubkey,
  pub buyer: Pubkey,
  pub collateral_mint: Pubkey,
  pub collateral_amount: u64,
  pub price_usd: u64,
}

#[event]
pub struct ListingPurchased {
  pub global_state: Pubkey,
  pub listing: Pubkey,
  pub nft: Pubkey,
  pub buyer: Pubkey,
  pub payment_mint: Pubkey,
  pub payment_amount: u64,
  pub dispute_period_expiry_ts: u64,
}

#[event]
pub struct ListingClosed {
  pub global_state: Pubkey,
  pub listing: Pubkey,
  pub nft: Pubkey,
}

#[event]
pub struct ListingDisputed {
  pub global_state: Pubkey,
  pub initiator: Pubkey,
  pub listing: Pubkey,
  pub nft: Pubkey,
}

#[event]
pub struct DisputeResolved {
  pub global_state: Pubkey,
  pub listing: Pubkey,
  pub nft: Pubkey,
  pub verdict: Verdict,
}
