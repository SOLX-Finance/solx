import { initSvm } from './fixtures/contract.fixture';
import { processTransaction } from './common/utils';
import { Transaction } from '@solana/web3.js';
import { expect } from 'chai';

describe('contracts', () => {
  it('Is initialized!', async () => {
    const { svm, program, accounts } = initSvm();

    const ix = new Transaction().add(
      await program.methods.initialize().instruction()
    );

    const tx = await processTransaction(svm, ix, [accounts[0]]);

    expect(tx).to.not.be.undefined;

    console.log('Your transaction signature', tx);
  });
});
