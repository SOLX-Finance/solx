import { Keypair, PublicKey } from '@solana/web3.js';

export const SOL_MINT = new PublicKey(
  'So11111111111111111111111111111111111111112',
);

export const SYSTEM_PROGRAM_ID = new PublicKey(
  '11111111111111111111111111111111',
);

export const METADATA_PROGRAM_ID = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
);

export const USDC_MINT = {
  address: Keypair.generate(),
};

export const seeds = {
  VAULT_SEED: Buffer.from('d_vault'),
  LISTING_SEED: Buffer.from('listing'),
  PAYMENT_MINT_SEED: Buffer.from('supported_payment_mint'),
  MINT_SEED: Buffer.from('mint'),
  METADATA_SEED: Buffer.from('metadata'),
  MASTER_EDITION_SEED: Buffer.from('edition'),
};
