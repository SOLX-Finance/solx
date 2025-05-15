use anchor_lang::prelude::*;

pub const DISPUTE_PERIOD_SECS: u64 = 60;

pub const PRICE_MAX_AGE: u8 = 255;

pub const PERCENTAGE_SCALE: u64 = 1_000_000_000;

pub const PRICE_SCALE: u64 = PERCENTAGE_SCALE;

pub mod seeds {
  pub const VAULT_SEED: &[u8; 7] = b"d_vault";
  pub const MINT_SEED: &[u8; 4] = b"mint";
  pub const METADATA_SEED: &[u8; 8] = b"metadata";
  pub const EDITION_SEED: &[u8; 7] = b"edition";
}

pub mod wsol {
  use anchor_lang::declare_id;
  declare_id!("So11111111111111111111111111111111111111112");
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub enum Verdict {
  BuyerFault,
  SellerFault,
  Refund,
}

pub const MAX_PRICE: u64 = 1_000_000;
