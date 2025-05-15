use anchor_lang::prelude::*;

use crate::{ error::SolxError, GlobalState, PaymentMintState };

#[derive(Accounts)]
#[instruction(payment_mint: Pubkey)]
pub struct UpdateMint<'info> {
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
    space = 8 + PaymentMintState::INIT_SPACE,
    seeds = [
      PaymentMintState::SEED,
      global_state.key().as_ref(),
      payment_mint.key().as_ref(),
    ],
    bump
  )]
  pub payment_mint_state: Account<'info, PaymentMintState>,

  pub system_program: Program<'info, System>,
}

pub fn handle(
  ctx: Context<UpdateMint>,
  _payment_mint: Pubkey,
  feed: String
) -> Result<()> {
  let payment_mint_state = &mut ctx.accounts.payment_mint_state;

  payment_mint_state.feed = feed;

  Ok(())
}
