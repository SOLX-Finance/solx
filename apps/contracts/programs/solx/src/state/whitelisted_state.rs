use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct WhitelistedState {
  pub whitelisted: bool,
}

impl WhitelistedState {
  pub const PAYMENT_MINT_SEED: &'static [u8; 22] = b"supported_payment_mint";
}
