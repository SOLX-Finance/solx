use anchor_lang::prelude::*;

use crate::{ error::SolxError, GlobalState, WhitelistedState };

#[derive(Accounts)]
#[instruction(mint: Pubkey)]
pub struct Whitelist<'info> {
  #[account(
    mut,
    constraint = authority.key().eq(&global_state.authority) @ SolxError::Forbidden
  )]
  pub authority: Signer<'info>,

  #[account(mut)]
  pub global_state: Account<'info, GlobalState>,

  #[account(
    init_if_needed,
    payer = authority,
    space = 8 + WhitelistedState::INIT_SPACE,
    seeds = [
      WhitelistedState::PAYMENT_MINT_SEED,
      global_state.key().as_ref(),
      mint.as_ref(),
    ],
    bump
  )]
  pub whitelisted_state: Account<'info, WhitelistedState>,

  pub system_program: Program<'info, System>,
}

pub fn handle(
  ctx: Context<Whitelist>,
  _mint: Pubkey,
  whitelisted: bool
) -> Result<()> {
  let whitelisted_state = &mut ctx.accounts.whitelisted_state;

  whitelisted_state.whitelisted = whitelisted;

  Ok(())
}
