import { randomUUID } from 'crypto';

import {
  DISPUTE_PERIOD_SECS,
  SOL_MINT,
  USDC_MINT,
} from './constants/constants';
import { initSvm } from './fixtures/contract.fixture';
import {
  closeListing,
  createListing,
  purchaseListing,
} from './helpers/solx.helpers';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { timeTravel } from './common/common.helpers';

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

  it.only('Create listing with spl collateral', async () => {
    const fixture = await initSvm();
    const uuid = randomUUID();

    await createListing(
      fixture,
      {
        uuid,
        name: 'Test NFT',
        symbol: 'TEST',
        uri: 'https://test.com',
        collateralMint: USDC_MINT.address.publicKey,
        collateralAmount: 1,
        price: 1,
      },
      {
        from: fixture.operator,
      },
    );
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

  it('Close listing', async () => {
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

    await closeListing(fixture, {
      uuid,
      collateralMint: SOL_MINT,
      paymentMint: null,
    });
  });

  it('Close listing if purchased', async () => {
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

    await purchaseListing(
      fixture,
      {
        uuid,
        paymentMint: SOL_MINT,
      },
      {
        from: fixture.operator,
      },
    );

    const now = await fixture.svm.getClock().unixTimestamp;
    await timeTravel(fixture.svm, now + DISPUTE_PERIOD_SECS + 100n);

    await closeListing(fixture, {
      uuid,
      collateralMint: SOL_MINT,
      paymentMint: SOL_MINT,
    });
  });
});
