use anchor_lang::prelude::*;

pub const DISPUTE_PERIOD_SECS: u64 = 7 * 24 * 60 * 60;

pub const PRICE_MAX_AGE: u8 = 120;

pub mod seeds {
  pub const VAULT_SEED: &[u8; 7] = b"d_vault";
  pub const MINT_SEED: &[u8; 4] = b"mint";
  pub const METADATA_SEED: &[u8; 8] = b"metadata";
  pub const EDITION_SEED: &[u8; 7] = b"edition";
}
