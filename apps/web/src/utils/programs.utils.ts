import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAccount,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
} from '@solana/spl-token';
import {
  Commitment,
  Connection,
  PublicKey,
  TransactionInstruction,
} from '@solana/web3.js';
import { BN } from 'bn.js';

import { Buffer } from 'buffer';

export const SOLX_PROGRAM_ID = new PublicKey(
  '8jbXs1fR9Bm5dh7N6Dr4ySsZWEeHeKTgsTYFjL386bcN',
);

export const METADATA_PROGRAM_ID = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
);
export const SOL_MINT = new PublicKey(
  'So11111111111111111111111111111111111111112',
);

export const PYTH_PRICE_UPDATE = new PublicKey(
  '7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE',
);

export const seeds = {
  VAULT_SEED: Buffer.from('d_vault'),
  LISTING_SEED: Buffer.from('listing'),
  PAYMENT_MINT_SEED: Buffer.from('supported_payment_mint'),
  MINT_SEED: Buffer.from('mint'),
  METADATA_SEED: Buffer.from('metadata'),
  MASTER_EDITION_SEED: Buffer.from('edition'),
  PAYMENT_MINT_STATE_SEED: Buffer.from('payment_mint_state'),
};

export function uuidToBytes(uuid: string): Uint8Array {
  const hexStr = uuid.replace(/-/g, '');

  if (hexStr.length !== 32) {
    throw new Error('Invalid UUID format');
  }

  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    bytes[i] = parseInt(hexStr.slice(i * 2, i * 2 + 2), 16);
  }

  return bytes;
}

export const toBN = (n: number | string | bigint) => {
  return new BN(n.toString());
};

export function getListing(globalState: PublicKey, nftMint: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [seeds.LISTING_SEED, globalState.toBuffer(), nftMint.toBuffer()],
    SOLX_PROGRAM_ID,
  );
}

export function getWhitelistedState(globalState: PublicKey, mint: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [seeds.PAYMENT_MINT_SEED, globalState.toBuffer(), mint.toBuffer()],
    SOLX_PROGRAM_ID,
  );
}

export function getNftMint(globalState: PublicKey, id: Uint8Array) {
  return PublicKey.findProgramAddressSync(
    [seeds.MINT_SEED, globalState.toBuffer(), id],
    SOLX_PROGRAM_ID,
  );
}

export function getMasterEditionAccount(nftMint: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [
      seeds.METADATA_SEED,
      METADATA_PROGRAM_ID.toBuffer(),
      nftMint.toBuffer(),
      seeds.MASTER_EDITION_SEED,
    ],
    METADATA_PROGRAM_ID,
  );
}

export function getNftMetadata(nftMint: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [seeds.METADATA_SEED, METADATA_PROGRAM_ID.toBuffer(), nftMint.toBuffer()],
    METADATA_PROGRAM_ID,
  );
}

export function getVault(globalState: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [seeds.VAULT_SEED, globalState.toBuffer()],
    SOLX_PROGRAM_ID,
  );
}

export function getPaymentMintState(globalState: PublicKey, mint: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [seeds.PAYMENT_MINT_STATE_SEED, globalState.toBuffer(), mint.toBuffer()],
    SOLX_PROGRAM_ID,
  );
}

export async function getCreateAssociatedTokenAccountInstruction(
  connection: Connection,
  mint: PublicKey,
  owner: PublicKey,
  allowOwnerOffCurve = false,
  commitment?: Commitment,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID,
): Promise<{
  createInx: TransactionInstruction | undefined;
  ata: PublicKey;
}> {
  const associatedToken = getAssociatedTokenAddressSync(
    mint,
    owner,
    allowOwnerOffCurve,
    programId,
    associatedTokenProgramId,
  );

  // This is the optimal logic, considering TX fee, client-side computation, RPC roundtrips and guaranteed idempotent.
  // Sadly we can't do this atomically.
  try {
    await getAccount(connection, associatedToken, commitment, programId);
  } catch (error: unknown) {
    // TokenAccountNotFoundError can be possible if the associated address has already received some lamports,
    // becoming a system account. Assuming program derived addressing is safe, this is the only case for the
    // TokenInvalidAccountOwnerError in this code path.
    if (
      error instanceof TokenAccountNotFoundError ||
      error instanceof TokenInvalidAccountOwnerError
    ) {
      return {
        createInx: createAssociatedTokenAccountInstruction(
          owner,
          associatedToken,
          owner,
          mint,
          programId,
          associatedTokenProgramId,
        ),
        ata: associatedToken,
      };
    }
  }
  return {
    createInx: undefined,
    ata: associatedToken,
  };
}
