use anchor_lang::prelude::*;

#[derive(InitSpace)]
#[account]
pub struct Dispute {
  pub initiator: Pubkey,
  pub resolved: bool,
}
