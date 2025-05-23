import { BN } from '@coral-xyz/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';

export const toBN = (n: number | string | bigint) => {
  return new BN(n.toString());
};

export const SOL_MINT = new PublicKey(
  'So11111111111111111111111111111111111111112',
);

export const SYSTEM_PROGRAM_ID = new PublicKey(
  '11111111111111111111111111111111',
);

export const METADATA_PROGRAM_ID = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
);

export const PYTH_PRICE_UPDATE_SOL = new PublicKey(
  '7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE',
);

export const PYTH_PRICE_UPDATE_USDC = new PublicKey(
  'Dpw1EAVrSB1ibxiDQyTAW6Zip3J4Btk2x4SgApQCeFbX',
);

export const DISPUTE_PERIOD_SECS = 60n;
//BigInt(7 * 24 * 60 * 60);

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
  PAYMENT_MINT_STATE_SEED: Buffer.from('payment_mint_state'),
};

export const listingState = {
  Opened: 'opened',
  Purchased: 'purchased',
  Disputed: 'disputed',
  Banned: 'banned',
};

export const FEED_IDS = {
  SOL: 'ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d',
  USDC: 'eaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a',
};

export const FEE = toBN(10000000);

export const FEE_DENOMINATOR = toBN(1_000_000_000);
