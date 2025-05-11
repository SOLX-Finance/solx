use anchor_lang::prelude::*;

use crate::{ seeds, GlobalState, Initialized };

#[derive(Accounts)]
pub struct Initialize<'info> {
  #[account(mut)]
  pub signer: Signer<'info>,

  #[account(init, payer = signer, space = 8 + GlobalState::INIT_SPACE)]
  pub global_state: Account<'info, GlobalState>,

  #[account(
    init,
    seeds = [seeds::VAULT_SEED, global_state.key().as_ref()],
    bump,
    payer = signer,
    space = 0
  )]
  /// CHECK:
  pub vault: AccountInfo<'info>,

  pub system_program: Program<'info, System>,
}

pub fn handler(
  ctx: Context<Initialize>,
  authority: Pubkey,
  operator: Pubkey,
  treasury: Pubkey,
  fee: u64
) -> Result<()> {
  let global_state = &mut ctx.accounts.global_state;
  global_state.authority = authority;
  global_state.operator = operator;
  global_state.treasury = treasury;
  global_state.fee = fee;

  emit!(Initialized {
    global_state: global_state.key(),
    authority,
    operator,
    treasury,
    fee,
  });

  Ok(())
}
