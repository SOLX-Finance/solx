import * as anchor from '@coral-xyz/anchor';
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import expect from 'expect';
import { LiteSVM } from 'litesvm';

import { Solx, IDL } from '../../target/types/solx';
import { toBN } from '../common/common.helpers';
import { LiteSvmProgram } from '../common/LiteSvm';
import { AddedAccount } from '../common/types';
import { processTransaction } from '../common/utils';
import { seeds } from '../constants/constants';
import { SOLX_PROGRAM_ID } from '../constants/contract.constants';

export const initSvm = async () => {
  const svm = new LiteSVM();

  const accounts: Keypair[] = [];
  const accountsToInject: AddedAccount[] = [];

  for (let i = 0; i < 35; i++) {
    const keypair = Keypair.generate();
    accounts.push(keypair);

    accountsToInject.push({
      address: keypair.publicKey,
      info: {
        lamports: 1000 * LAMPORTS_PER_SOL,
        data: Buffer.alloc(0),
        owner: SystemProgram.programId,
        executable: false,
      },
    });
  }

  accountsToInject.forEach((acc) => {
    svm.setAccount(acc.address, acc.info);
  });

  svm.addProgramFromFile(SOLX_PROGRAM_ID, 'target/deploy/solx.so');

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

  return {
    svm,
    program: customProgram,
    accounts,
    globalState: gState,
    vault,
  };
};
