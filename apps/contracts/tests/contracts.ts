import { randomUUID } from 'crypto';

import { SOL_MINT } from './constants/constants';
import { initSvm } from './fixtures/contract.fixture';
import { createListing } from './helpers/solx.helpers';

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
});
