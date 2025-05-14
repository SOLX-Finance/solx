import * as mpl from '@metaplex-foundation/mpl-token-metadata';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { PublicKey, Transaction } from '@solana/web3.js';
import { expect } from 'expect';

import {
  expectNotReverted,
  expectReverted,
  getListing,
  getMasterEditionAccount,
  getNftMint,
  getNftMetadata,
  getOrCreateAta,
  getWhitelistedState,
  OptionalCommonParams,
  toBN,
  getVault,
  getPaymentMintState,
  getBalance,
} from '../common/common.helpers';
import { processTransaction } from '../common/utils';
import {
  DISPUTE_PERIOD_SECS,
  FEE,
  FEE_DENOMINATOR,
  listingState,
  METADATA_PROGRAM_ID,
  PYTH_PRICE_UPDATE,
  SOL_MINT,
} from '../constants/constants';
import { ContractFixture } from '../fixtures/contract.fixture';

export function uuidToBytes(uuid: string): Uint8Array {
  const hexStr = uuid.replace(/-/g, '');

  if (hexStr.length !== 32) {
    throw new Error('Invalid UUID format');
  }

  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    bytes[i] = parseInt(hexStr.slice(i * 2, i * 2 + 2), 16);
  }

  return bytes;
}

export const createListing = async (
  fixture: ContractFixture,
  testProps: {
    uuid: string;
    name: string;
    symbol: string;
    uri: string;
    collateralMint: PublicKey;
    collateralAmount: number;
    price: number;
  },
  opt?: OptionalCommonParams,
) => {
  const { uuid, name, symbol, uri, collateralMint, collateralAmount, price } =
    testProps;

  const { program, globalState, authority } = fixture;

  const from = opt?.from ?? authority;

  const listingIdBytes = uuidToBytes(uuid);

  const [nftMint] = getNftMint(globalState.publicKey, listingIdBytes);

  const listerNftTokenAccount = getAssociatedTokenAddressSync(
    nftMint,
    from.publicKey,
    true,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );

  const [listing] = getListing(globalState.publicKey, nftMint);

  const [masterEdition] = getMasterEditionAccount(nftMint);

  const listingCollateralMintAccount = !collateralMint.equals(SOL_MINT)
    ? await getOrCreateAta(collateralMint, fixture.svm, listing, from)
    : null;

  const listerCollateralMintAccount = !collateralMint.equals(SOL_MINT)
    ? await getOrCreateAta(collateralMint, fixture.svm, from.publicKey, from)
    : null;
  // console.log(
  //   collateralMint.toBase58(),
  //   from.publicKey.toBase58(),
  //   from.publicKey.toBase58(),
  //   ' ARGS',
  // );
  // console.log(from.publicKey, ' FROM');
  // console.log(listerCollateralMintAccount?.ataAccount, ' LISTEER ACC');

  const [whitelistedState] = getWhitelistedState(
    globalState.publicKey,
    collateralMint,
  );

  const [nftMetadata] = getNftMetadata(nftMint);

  const [vault] = getVault(globalState.publicKey);
  console.log({
    payer: from.publicKey,
    lister: from.publicKey,
    globalState: globalState.publicKey,
    globalStateAuthority: authority.publicKey,
    vault,
    nftMint,
    nftTokenAccount: listerNftTokenAccount,
    masterEditionAccount: masterEdition,
    nftMetadata,
    metadataProgram: METADATA_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    tokenProgram: TOKEN_PROGRAM_ID,
  });
  const createNftIx = new Transaction().add(
    await program.methods
      .mintNft(Array.from(listingIdBytes), name, symbol, uri)
      .accounts({
        payer: from.publicKey,
        lister: from.publicKey,
        globalState: globalState.publicKey,
        globalStateAuthority: authority.publicKey,
        vault,
        nftMint,
        nftTokenAccount: listerNftTokenAccount,
        masterEditionAccount: masterEdition,
        nftMetadata,
        metadataProgram: METADATA_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .transaction(),
  );

  await expectNotReverted(processTransaction(fixture.svm, createNftIx, [from]));

  const createListingTx = new Transaction().add(
    await program.methods
      .createListing(
        Array.from(listingIdBytes),
        toBN(collateralAmount),
        toBN(price),
      )
      .accounts({
        lister: from.publicKey,
        globalState: globalState.publicKey,
        collateralMint,
        listing,
        listingCollateralMintAccount: listingCollateralMintAccount?.ata ?? null,
        listerCollateralMintAccount: listerCollateralMintAccount?.ata ?? null,
        whitelistedState,
        nftTokenAccount: listerNftTokenAccount,
        nftMint,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .transaction(),
  );

  if (opt?.revertedWith) {
    await expectReverted(
      processTransaction(fixture.svm, createListingTx, [from]),
      opt.revertedWith.message,
    );
    return;
  }

  await expectNotReverted(
    processTransaction(fixture.svm, createListingTx, [from]),
  );

  const listingAccount = await fixture.program.account.listing.fetch(listing);

  expect(listingAccount.nft.toBase58()).toBe(nftMint.toBase58());
  expect(listingAccount.collateralMint.toBase58()).toBe(
    collateralMint.toBase58(),
  );
  expect(listingAccount.priceUsd.toString()).toBe(price.toString());
  expect(listingAccount.collateralAmount.toString()).toBe(
    collateralAmount.toString(),
  );
  expect(Object.keys(listingAccount.state)[0]).toBe(listingState.Opened);

  const nftMetadataAccount = fixture.svm.getAccount(nftMetadata);

  const metadata = mpl.deserializeMetadata({
    // @ts-expect-error Because PublicKeys are the same types
    publicKey: nftMetadata,
    data: nftMetadataAccount.data,
  });

  expect(metadata.name).toBe(name);
  expect(metadata.symbol).toBe(symbol);
  expect(metadata.uri).toBe(uri);
};

export async function purchaseListing(
  fixture: ContractFixture,
  testProps: {
    uuid: string;
    paymentMint: PublicKey;
  },
  opt?: OptionalCommonParams,
) {
  const { uuid, paymentMint } = testProps;

  const { program, globalState, authority } = fixture;

  const from = opt?.from ?? authority;

  const listingIdBytes = uuidToBytes(uuid);

  const [nftMint] = getNftMint(globalState.publicKey, listingIdBytes);

  const [listing] = getListing(globalState.publicKey, nftMint);

  const listingPaymentMintAccount = await getOrCreateAta(
    paymentMint,
    fixture.svm,
    listing,
    from,
  );

  const buyerPaymentMintAccount = await getOrCreateAta(
    paymentMint,
    fixture.svm,
    from.publicKey,
    from,
  );

  const [whitelistedState] = getWhitelistedState(
    globalState.publicKey,
    paymentMint,
  );

  const [paymentMintState] = getPaymentMintState(
    globalState.publicKey,
    paymentMint,
  );

  const purchaseListingTx = new Transaction().add(
    await program.methods
      .purchase(Array.from(listingIdBytes))
      .accounts({
        buyer: from.publicKey,
        globalState: globalState.publicKey,
        listing,
        nftMint,
        listingPaymentMintAccount: listingPaymentMintAccount.ata,
        buyerPaymentMintAccount: buyerPaymentMintAccount.ata,
        whitelistedState,
        paymentMintState,
        priceUpdate: PYTH_PRICE_UPDATE,
        paymentMint,
        tokenProgram: TOKEN_PROGRAM_ID,
        tokenProgram2022: TOKEN_2022_PROGRAM_ID,
      })
      .transaction(),
  );

  if (opt?.revertedWith) {
    await expectReverted(
      processTransaction(fixture.svm, purchaseListingTx, [from]),
      opt.revertedWith.message,
    );
    return;
  }

  const now = fixture.svm.getClock().unixTimestamp;

  await expectNotReverted(
    processTransaction(fixture.svm, purchaseListingTx, [from]),
  );

  const listingAccount = await fixture.program.account.listing.fetch(listing);

  expect(BigInt(listingAccount.expiryTs.toNumber())).toBe(
    now + DISPUTE_PERIOD_SECS,
  );

  expect(Object.keys(listingAccount.state)[0]).toBe(listingState.Purchased);
}

export async function closeListing(
  fixture: ContractFixture,
  testProps: {
    uuid: string;
    collateralMint: PublicKey;
    paymentMint: PublicKey | null;
  },
  opt?: OptionalCommonParams,
) {
  const { uuid, collateralMint, paymentMint } = testProps;

  const { program, globalState, authority, treasury } = fixture;

  const from = opt?.from ?? authority;

  const listingIdBytes = uuidToBytes(uuid);

  const [nftMint] = getNftMint(globalState.publicKey, listingIdBytes);

  const [listing] = getListing(globalState.publicKey, nftMint);

  const listingCollateralMintAccount = await getOrCreateAta(
    collateralMint,
    fixture.svm,
    listing,
    from,
  );

  const listingPaymentMintAccount = paymentMint
    ? await getOrCreateAta(paymentMint, fixture.svm, listing, from)
    : null;

  const authorityCollateralMintAccount = await getOrCreateAta(
    collateralMint,
    fixture.svm,
    from.publicKey,
    from,
  );

  const authorityPaymentMintAccount = paymentMint
    ? await getOrCreateAta(paymentMint, fixture.svm, from.publicKey, from)
    : null;

  const treasuryPaymentMintAccount = paymentMint
    ? await getOrCreateAta(paymentMint, fixture.svm, treasury.publicKey, from)
    : null;

  const [collateralWhitelistedState] = getWhitelistedState(
    globalState.publicKey,
    collateralMint,
  );

  const paymentWhitelistedState = paymentMint
    ? getWhitelistedState(globalState.publicKey, paymentMint)
    : null;

  const listerNftTokenAccount = getAssociatedTokenAddressSync(
    nftMint,
    from.publicKey,
    true,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );

  const closeListingTx = new Transaction().add(
    await program.methods
      .closeListing(Array.from(listingIdBytes))
      .accounts({
        authority: from.publicKey,
        treasury: treasury.publicKey,
        globalState: globalState.publicKey,
        listing,
        listingCollateralMintAccount: listingCollateralMintAccount.ata,
        listingPaymentMintAccount: listingPaymentMintAccount?.ata ?? null,
        authorityCollateralMintAccount: authorityCollateralMintAccount.ata,
        authorityPaymentMintAccount: authorityPaymentMintAccount?.ata ?? null,
        treasuryPaymentMintAccount: treasuryPaymentMintAccount?.ata ?? null,
        collateralMint: collateralMint,
        paymentMint: paymentMint,
        collateralWhitelistedState: collateralWhitelistedState,
        paymentWhitelistedState: paymentWhitelistedState?.[0] ?? null,
        nftMint,
        nftTokenAccount: listerNftTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        tokenProgram2022: TOKEN_2022_PROGRAM_ID,
      })
      .transaction(),
  );

  if (opt?.revertedWith) {
    await expectReverted(
      processTransaction(fixture.svm, closeListingTx, [from]),
      opt.revertedWith.message,
    );
  }
  const listingAccount = await fixture.program.account.listing.fetch(listing);

  const listingCollateralBalanceBefore = collateralMint.equals(SOL_MINT)
    ? await fixture.svm.getBalance(listing)
    : await getBalance(fixture.svm, collateralMint, listing);

  const listingPaymentBalanceBefore = paymentMint
    ? paymentMint.equals(SOL_MINT)
      ? await fixture.svm.getBalance(listing)
      : await getBalance(fixture.svm, paymentMint, listing)
    : 0n;

  const authorityCollateralBalanceBefore = collateralMint.equals(SOL_MINT)
    ? await fixture.svm.getBalance(authority.publicKey)
    : await getBalance(fixture.svm, collateralMint, authority.publicKey);

  const authorityPaymentBalanceBefore = paymentMint
    ? paymentMint.equals(SOL_MINT)
      ? await fixture.svm.getBalance(authority.publicKey)
      : await getBalance(fixture.svm, paymentMint, authority.publicKey)
    : 0n;

  const treasuryPaymentBalanceBefore = paymentMint
    ? paymentMint.equals(SOL_MINT)
      ? await fixture.svm.getBalance(treasury.publicKey)
      : await getBalance(fixture.svm, paymentMint, treasury.publicKey)
    : 0n;

  await expectNotReverted(
    processTransaction(fixture.svm, closeListingTx, [from]),
  );

  const listingCollateralBalanceAfter = collateralMint.equals(SOL_MINT)
    ? await fixture.svm.getBalance(listing)
    : await getBalance(fixture.svm, collateralMint, listing);

  const authorityCollateralBalanceAfter = collateralMint.equals(SOL_MINT)
    ? await fixture.svm.getBalance(authority.publicKey)
    : await getBalance(fixture.svm, collateralMint, authority.publicKey);

  const listingPaymentBalanceAfter = paymentMint
    ? paymentMint.equals(SOL_MINT)
      ? await fixture.svm.getBalance(listing)
      : await getBalance(fixture.svm, paymentMint, listing)
    : 0n;

  const authorityPaymentBalanceAfter = paymentMint
    ? paymentMint.equals(SOL_MINT)
      ? await fixture.svm.getBalance(authority.publicKey)
      : await getBalance(fixture.svm, paymentMint, authority.publicKey)
    : 0n;

  const treasuryPaymentBalanceAfter = paymentMint
    ? paymentMint.equals(SOL_MINT)
      ? await fixture.svm.getBalance(treasury.publicKey)
      : await getBalance(fixture.svm, paymentMint, treasury.publicKey)
    : 0n;

  const feeAmount = listingAccount.paymentAmount.mul(FEE).div(FEE_DENOMINATOR);

  expect(listingCollateralBalanceAfter).toBeLessThan(
    listingCollateralBalanceBefore,
  );

  if (paymentMint) {
    expect(listingPaymentBalanceAfter).toBeLessThan(
      listingPaymentBalanceBefore,
    );
  }

  expect(Number(authorityCollateralBalanceAfter)).toBeCloseTo(
    paymentMint
      ? paymentMint.equals(collateralMint)
        ? Number(authorityCollateralBalanceBefore) +
          Number(listingAccount.collateralAmount.toNumber()) +
          Number(listingAccount.paymentAmount.sub(feeAmount).toNumber())
        : Number(authorityCollateralBalanceBefore) +
          Number(listingAccount.collateralAmount.toNumber())
      : Number(authorityCollateralBalanceBefore),
    -5,
  );

  if (paymentMint) {
    expect(authorityPaymentBalanceAfter).toBeGreaterThan(
      authorityPaymentBalanceBefore,
    );
  }

  expect(Number(treasuryPaymentBalanceAfter)).toBe(
    Number(treasuryPaymentBalanceBefore) + Number(feeAmount),
  );
}
