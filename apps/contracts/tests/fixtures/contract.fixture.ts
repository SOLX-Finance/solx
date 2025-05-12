/* eslint-disable @typescript-eslint/no-explicit-any */
import * as anchor from '@coral-xyz/anchor';
import {
  ACCOUNT_SIZE,
  AccountLayout,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import expect from 'expect';
import { LiteSVM } from 'litesvm';

import { Solx, IDL } from '../../target/types/solx';
import {
  createMint,
  getWhitelistedState,
  toBN,
} from '../common/common.helpers';
import { LiteSvmProgram } from '../common/LiteSvm';
import { AddedAccount } from '../common/types';
import { processTransaction } from '../common/utils';
import {
  METADATA_PROGRAM_ID,
  seeds,
  SOL_MINT,
  USDC_MINT,
} from '../constants/constants';
import { SOLX_PROGRAM_ID } from '../constants/contract.constants';

export const connection = new Connection('https://solana-rpc.publicnode.com');

let WSOL_DATA: any = undefined;

export const initSvm = async () => {
  const svm = new LiteSVM();

  if (!WSOL_DATA) {
    const wsolData = await connection.getAccountInfo(SOL_MINT);

    if (wsolData) {
      WSOL_DATA = {
        ...wsolData,
        rentEpoch: 123,
      };
    }
  }

  svm.setAccount(SOL_MINT, WSOL_DATA);

  const accounts: Keypair[] = [];
  const accountsToInject: AddedAccount[] = [];
  const usdcToOwn = 1_000_000_000_000n;

  const usdcTokenAccData = Buffer.alloc(ACCOUNT_SIZE);

  let usdcMint: PublicKey | undefined;

  for (let i = 0; i < 10; i++) {
    const keypair = Keypair.generate();

    if (i === 0) {
      const acc = {
        address: keypair.publicKey,
        info: {
          lamports: 1000 * LAMPORTS_PER_SOL,
          data: Buffer.alloc(0),
          owner: SystemProgram.programId,
          executable: false,
        },
      };

      svm.setAccount(acc.address, acc.info);

      usdcMint = await createMint(
        svm,
        keypair,
        keypair.publicKey,
        null,
        6,
        USDC_MINT.address,
      );
    }

    if (!usdcMint) {
      throw new Error('USDC mint not found');
    }

    const ata = getAssociatedTokenAddressSync(
      usdcMint,
      keypair.publicKey,
      true,
    );

    AccountLayout.encode(
      {
        mint: usdcMint,
        owner: keypair.publicKey,
        amount: usdcToOwn,
        delegateOption: 0,
        delegate: PublicKey.default,
        delegatedAmount: 0n,
        state: 1,
        isNativeOption: 0,
        isNative: 0n,
        closeAuthorityOption: 0,
        closeAuthority: PublicKey.default,
      },
      usdcTokenAccData,
    );

    accounts.push(keypair);

    accountsToInject.push(
      {
        address: keypair.publicKey,
        info: {
          lamports: 1000 * LAMPORTS_PER_SOL,
          data: Buffer.alloc(0),
          owner: SystemProgram.programId,
          executable: false,
        },
      },
      {
        address: ata,
        info: {
          lamports: 1_000_000_000,
          data: usdcTokenAccData,
          owner: TOKEN_PROGRAM_ID,
          executable: false,
        },
      },
    );
  }

  accountsToInject.forEach((acc) => {
    svm.setAccount(acc.address, acc.info);
  });

  svm.addProgramFromFile(SOLX_PROGRAM_ID, 'target/deploy/solx.so');
  svm.addProgramFromFile(METADATA_PROGRAM_ID, 'tests/fixtures/metadata.so');

  const program = new LiteSvmProgram<Solx>(IDL, SOLX_PROGRAM_ID, svm);

  const customProgram = program.liteProgram() as anchor.Program<Solx>;

  const authority = accounts[0];
  const operator = accounts[1];
  const treasury = accounts[2];

  const fee = toBN(10000000);

  const globalState = Keypair.generate();

  const [vault] = PublicKey.findProgramAddressSync(
    [seeds.VAULT_SEED, globalState.publicKey.toBuffer()],
    SOLX_PROGRAM_ID,
  );

  const initProtocolTx = new Transaction().add(
    await customProgram.methods
      .initialize(
        authority.publicKey,
        operator.publicKey,
        treasury.publicKey,
        fee,
      )
      .accounts({
        signer: authority.publicKey,
        globalState: globalState.publicKey,
        vault,
      })
      .signers([authority, globalState])
      .instruction(),
  );

  await processTransaction(svm, initProtocolTx, [authority, globalState]);

  const gState = await customProgram.account.globalState.fetch(
    globalState.publicKey,
  );

  expect(gState.fee.toString()).toBe(fee.toString());
  expect(gState.authority.toString()).toBe(authority.publicKey.toString());
  expect(gState.operator.toString()).toBe(operator.publicKey.toString());
  expect(gState.treasury.toString()).toBe(treasury.publicKey.toString());

  const [whitelistedStateUsdc] = getWhitelistedState(
    globalState.publicKey,
    usdcMint,
  );

  const [whitelistedStateSol] = getWhitelistedState(
    globalState.publicKey,
    SOL_MINT,
  );

  const whitelistUsdcIx = new Transaction().add(
    await customProgram.methods
      .whitelist(usdcMint, true)
      .accounts({
        authority: authority.publicKey,
        globalState: globalState.publicKey,
        whitelistedState: whitelistedStateUsdc,
      })
      .signers([authority])
      .instruction(),
  );

  const whitelistSolIx = new Transaction().add(
    await customProgram.methods
      .whitelist(SOL_MINT, true)
      .accounts({
        authority: authority.publicKey,
        globalState: globalState.publicKey,
        whitelistedState: whitelistedStateSol,
      })
      .signers([authority])
      .instruction(),
  );

  await processTransaction(svm, whitelistUsdcIx, [authority]);
  await processTransaction(svm, whitelistSolIx, [authority]);

  return {
    svm,
    program: customProgram,
    accounts,
    globalState,
    vault,
    authority,
    operator,
    treasury,
  };
};

export type ContractFixture = Awaited<ReturnType<typeof initSvm>>;
