import { randomUUID } from 'crypto';

import { SOL_MINT } from './constants/constants';
import { initSvm } from './fixtures/contract.fixture';
import { createListing, purchaseListing } from './helpers/solx.helpers';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

describe('contracts', () => {
  it('Is initialized!', async () => {
    await initSvm();
  });

  it('Create listing', async () => {
    const fixture = await initSvm();
    const uuid = randomUUID();

    await createListing(fixture, {
      uuid,
      name: 'Test NFT',
      symbol: 'TEST',
      uri: 'https://test.com',
      collateralMint: SOL_MINT,
      collateralAmount: 1,
      price: 1,
    });
  });

  it('Purchase listing', async () => {
    const fixture = await initSvm();
    const uuid = randomUUID();

    await createListing(fixture, {
      uuid,
      name: 'Test NFT',
      symbol: 'TEST',
      uri: 'https://test.com',
      collateralMint: SOL_MINT,
      collateralAmount: 1,
      price: 177 * 10 ** 9,
    });

    await purchaseListing(fixture, {
      uuid,
      paymentMint: SOL_MINT,
    });
  });
});
