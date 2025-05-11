use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct PaymentMintState {
  #[max_len(88)]
  pub feed: String,
}

impl PaymentMintState {
  pub const SEED: &'static [u8; 18] = b"payment_mint_state";
}
