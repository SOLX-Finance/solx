import { randomUUID } from 'crypto';

import { timeTravel } from './common/common.helpers';
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

  it('Create listing with spl collateral', async () => {
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
        from: fixture.treasury,
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

  it('Purchase listing with spl collateral', async () => {
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
      paymentMint: USDC_MINT.address.publicKey,
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

  it('Close listing with spl collateral', async () => {
    const fixture = await initSvm();
    const uuid = randomUUID();

    await createListing(fixture, {
      uuid,
      name: 'Test NFT',
      symbol: 'TEST',
      uri: 'https://test.com',
      collateralMint: USDC_MINT.address.publicKey,
      collateralAmount: 1,
      price: 177 * 10 ** 9,
    });

    await closeListing(fixture, {
      uuid,
      collateralMint: USDC_MINT.address.publicKey,
      paymentMint: null,
    });
  });

  it('Close listing if purchased with sol purchase and sol collateral', async () => {
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

  it('Close listing if purchased with spl purchase and collateral', async () => {
    const fixture = await initSvm();
    const uuid = randomUUID();

    await createListing(fixture, {
      uuid,
      name: 'Test NFT',
      symbol: 'TEST',
      uri: 'https://test.com',
      collateralMint: USDC_MINT.address.publicKey,
      collateralAmount: 1,
      price: 177 * 10 ** 9,
    });

    await purchaseListing(
      fixture,
      {
        uuid,
        paymentMint: USDC_MINT.address.publicKey,
      },
      {
        from: fixture.operator,
      },
    );

    const now = await fixture.svm.getClock().unixTimestamp;
    await timeTravel(fixture.svm, now + DISPUTE_PERIOD_SECS + 100n);

    await closeListing(fixture, {
      uuid,
      collateralMint: USDC_MINT.address.publicKey,
      paymentMint: USDC_MINT.address.publicKey,
    });
  });

  it('Close listing if purchased with spl purchase and sol collateral', async () => {
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
        paymentMint: USDC_MINT.address.publicKey,
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
      paymentMint: USDC_MINT.address.publicKey,
    });
  });

  it('Close listing if purchased with sol purchase and spl collateral', async () => {
    const fixture = await initSvm();
    const uuid = randomUUID();

    await createListing(fixture, {
      uuid,
      name: 'Test NFT',
      symbol: 'TEST',
      uri: 'https://test.com',
      collateralMint: USDC_MINT.address.publicKey,
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
      collateralMint: USDC_MINT.address.publicKey,
      paymentMint: SOL_MINT,
    });
  });
});
