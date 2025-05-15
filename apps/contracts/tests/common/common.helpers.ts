/* eslint-disable @typescript-eslint/no-explicit-any */
import { BN } from '@coral-xyz/anchor';
import { Idl } from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/utils/token';
import {
  AccountLayout,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createInitializeMint2Instruction,
  createSyncNativeInstruction,
  getAssociatedTokenAddressSync,
  MINT_SIZE,
  MintLayout,
  NATIVE_MINT,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
} from '@solana/spl-token';
import {
  Keypair,
  LAMPORTS_PER_SOL,
  Signer,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { PublicKey } from '@solana/web3.js';
import expect from 'expect';
import { Clock, LiteSVM } from 'litesvm';

import { processTransaction } from './utils';

import {
  METADATA_PROGRAM_ID,
  seeds,
  SOL_MINT,
  SYSTEM_PROGRAM_ID,
} from '../constants/constants';
import { SOLX_PROGRAM_ID } from '../constants/contract.constants';

export type OptionalCommonParams = {
  from?: Keypair;
  revertedWith?: {
    message?: string;
  };
};

export const expectNotReverted = async (promise: Promise<unknown>) => {
  try {
    await promise;
  } catch (err) {
    console.error(
      `Expected tx to not revert, but it reverted. Err: ${err.toString()}`,
    );
    expect(true).toEqual(false);
  }
};

export const expectReverted = async (
  promise: Promise<unknown>,
  reason?: string,
) => {
  let isReverted = true;

  try {
    await promise;
    isReverted = false;
    throw '';
  } catch (err) {
    const message = err.toString();
    if (!isReverted) {
      console.error('Expect reverted, but it didn`t revert');
      expect(true).toStrictEqual(false);
    } else if (reason) {
      expect(message).toContain(reason);
    }
  }
};

export const getBalance = async (
  svm: LiteSVM,
  mint: PublicKey,
  owner: PublicKey,
  tokenProgram = TOKEN_PROGRAM_ID,
  signer?: Keypair,
  isAta = false,
) => {
  const ata = !isAta
    ? getAssociatedTokenAddressSync(mint, owner, true, tokenProgram)
    : owner;

  if (mint.equals(SOL_MINT)) {
    return svm.getBalance(owner) ?? 0n;
  } else {
    const account = await svm.getAccount(ata);

    if (!account || account.owner.equals(SYSTEM_PROGRAM_ID)) {
      if (signer) {
        const { ataAccount } = await getOrCreateAta(
          mint,
          svm,
          owner,
          signer,
          tokenProgram,
        );
        return ataAccount.amount;
      }
      return 0n;
    }
    const parsed = AccountLayout.decode(account.data);
    return parsed.amount;
  }
};

export const fromBN = (bn?: BN) => {
  return BigInt((bn ?? 0).toString());
};

export const toBN = (n: number | string | bigint) => {
  return new BN(n.toString());
};

export const findPDA = <TProgram extends Idl | unknown>(
  seeds: Array<string | Buffer | PublicKey | BN>,
  program: TProgram extends Idl ? Program<TProgram> : PublicKey,
) => {
  const programId = (program as Program).programId || (program as PublicKey);

  return PublicKey.findProgramAddressSync(
    [
      ...seeds.map((v) =>
        Buffer.from((v as PublicKey)?.toBuffer?.() ?? (v as string | Buffer)),
      ),
    ],
    programId,
  );
};

export const parseUnitsDefault = (n: string, decimals = 6) => {
  return toBN(n).pow(toBN(decimals)).toString();
};

export const createMint = async (
  svm: LiteSVM,
  payer: Signer,
  mintAuthority: PublicKey,
  freezeAuthority: PublicKey | null,
  decimals: number,
  keypair = Keypair.generate(),
  programId = TOKEN_PROGRAM_ID,
) => {
  const createAccIx = (lamports: number | bigint) => {
    return SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: keypair.publicKey,
      space: MINT_SIZE,
      lamports: Number(lamports),
      programId,
    });
  };

  await processTransaction(
    svm,
    new Transaction().add(createAccIx(LAMPORTS_PER_SOL)),
    [payer, keypair],
  );

  const transaction = new Transaction().add(
    createInitializeMint2Instruction(
      keypair.publicKey,
      decimals,
      mintAuthority,
      freezeAuthority,
      programId,
    ),
  );

  await processTransaction(svm, transaction, [payer]);

  return keypair.publicKey;
};

export const timeTravel = async (svm: LiteSVM, timestamp: bigint) => {
  const currentClock = await svm.getClock();
  svm.setClock(
    new Clock(
      currentClock.slot,
      currentClock.epochStartTimestamp,
      currentClock.epoch,
      currentClock.leaderScheduleEpoch,
      timestamp,
    ),
  );
};

export const getTime = async (svm: LiteSVM) => {
  return svm.getClock().unixTimestamp;
};

export function createAtaInx(
  payer: PublicKey,
  ataAccount: PublicKey,
  mint: PublicKey,
  owner = payer,
  tokenProgramId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID,
) {
  return createAssociatedTokenAccountInstruction(
    payer,
    ataAccount,
    owner,
    mint,
    tokenProgramId,
    associatedTokenProgramId,
  );
}

export const getMint = (svm: LiteSVM, mintAddress: PublicKey) => {
  const data = svm.getAccount(mintAddress);

  if (!data) throw new Error('No such mint!');

  const parsedMint = MintLayout.decode(data.data);

  return parsedMint;
};

export const getOrCreateAta = async (
  mint: PublicKey,
  svm: LiteSVM,
  owner: PublicKey,
  signer: Keypair,
  programId = TOKEN_PROGRAM_ID,
) => {
  const ata = getAssociatedTokenAddressSync(
    mint,
    owner,
    true,
    programId,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );

  try {
    const ataAccount = svm.getAccount(ata);
    if (!ataAccount || ataAccount.data.length === 0)
      throw new Error('Could not find');

    const parsed = AccountLayout.decode(ataAccount.data);

    return {
      ataAccount: parsed,
      ata,
    };
  } catch (e: any) {
    if (
      e instanceof TokenAccountNotFoundError ||
      e instanceof TokenInvalidAccountOwnerError ||
      e?.message?.includes('Could not find')
    ) {
      const ix = new Transaction().add(
        createAtaInx(signer.publicKey, ata, mint, owner, programId),
      );
      await processTransaction(svm, ix, [signer]);

      const ataAccount = svm.getAccount(ata);
      const parsed = AccountLayout.decode(ataAccount.data);

      const actualOwner = new PublicKey(parsed.owner);
      if (!actualOwner.equals(owner)) {
        throw new Error(
          `ATA exists but has wrong owner: expected ${owner.toBase58()}, got ${actualOwner.toBase58()}`,
        );
      }

      return {
        ataAccount: parsed,
        ata,
      };
    }
    throw e;
  }
};

export async function wrapSol(
  svm: LiteSVM,
  wallet: PublicKey,
  payer: Keypair,
  needToTransfer = true,
): Promise<PublicKey> {
  const { ata } = await getOrCreateAta(NATIVE_MINT, svm, wallet, payer);

  const ixs: TransactionInstruction[] = [
    needToTransfer
      ? SystemProgram.transfer({
          fromPubkey: wallet,
          toPubkey: ata,
          lamports: LAMPORTS_PER_SOL,
        })
      : undefined,
    createSyncNativeInstruction(ata),
  ].filter(Boolean) as TransactionInstruction[];

  if (ixs.length > 0) {
    const wrapTransaction = new Transaction().add(...ixs);
    await processTransaction(svm, wrapTransaction, [payer]);
  }

  return ata;
}

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
