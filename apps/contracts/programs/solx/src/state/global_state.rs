use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct GlobalState {
  pub authority: Pubkey,
  pub operator: Pubkey,

  pub treasury: Pubkey,

  pub fee: u64,
}

impl GlobalState {
  pub const SEED: &'static [u8; 12] = b"global_state";
}
