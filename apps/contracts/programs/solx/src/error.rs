use anchor_lang::prelude::*;

#[error_code]
pub enum SolxError {
  #[msg("Custom error message")]
  CustomError,

  #[msg("Mint is not whitelisted")]
  MintNotWhitelisted,

  #[msg("Invalid state")]
  InvalidState,
}
