import { Transaction } from '@solana/web3.js';
import { expect } from 'chai';

import { processTransaction } from './common/utils';
import { initSvm } from './fixtures/contract.fixture';

describe('contracts', () => {
  it('Is initialized!', async () => {
    await initSvm();
  });
});
