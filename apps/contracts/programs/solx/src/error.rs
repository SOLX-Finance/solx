use anchor_lang::prelude::*;

#[error_code]
pub enum SolxError {
  #[msg("Forbidden")]
  Forbidden,

  #[msg("Mint is not whitelisted")]
  MintNotWhitelisted,

  #[msg("Invalid state")]
  InvalidState,

  #[msg("Invalid initiator")]
  InvalidInitiator,

  #[msg("Expired")]
  Expired,

  #[msg("Invalid mint")]
  InvalidMint,

  #[msg("Invalid buyer")]
  InvalidBuyer,

  #[msg("Invalid seller")]
  InvalidSeller,

  #[msg("Invalid treasury")]
  InvalidTreasury,

  #[msg("Invalid payment mint")]
  InvalidPaymentMint,

  #[msg("Invalid collateral mint")]
  InvalidCollateralMint,
}
