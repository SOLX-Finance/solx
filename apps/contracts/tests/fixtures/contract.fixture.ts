import * as anchor from '@coral-xyz/anchor';
import { LiteSVM } from 'litesvm';
import { LiteSvmProgram } from '../common/LiteSvm';
import { Contracts, IDL } from '../../target/types/contracts';
import { CONTRACTS_PROGRAM_ID } from '../constants/contract.constants';
import { AddedAccount } from '../common/types';
import { Keypair, LAMPORTS_PER_SOL, SystemProgram } from '@solana/web3.js';

export const initSvm = () => {
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

  svm.addProgramFromFile(
    CONTRACTS_PROGRAM_ID,
    './apps/contracts/target/deploy/contracts.so'
  );

  const program = new LiteSvmProgram<Contracts>(IDL, CONTRACTS_PROGRAM_ID, svm);

  const customProgram = program.liteProgram() as anchor.Program<Contracts>;

  return {
    svm,
    program: customProgram,
    accounts,
  };
};
