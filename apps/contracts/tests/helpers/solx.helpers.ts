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
} from '../common/common.helpers';
import { processTransaction } from '../common/utils';
import {
  listingState,
  METADATA_PROGRAM_ID,
  PYTH_PRICE_UPDATE,
  SOL_MINT,
} from '../constants/constants';
import { ContractFixture } from '../fixtures/contract.fixture';

function uuidToBytes(uuid: string): Uint8Array {
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

  const listerCollateralMintAccount = !collateralMint.equals(SOL_MINT)
    ? await getOrCreateAta(collateralMint, fixture.svm, from.publicKey, from)
    : null;

  const listingCollateralMintAccount = !collateralMint.equals(SOL_MINT)
    ? await getOrCreateAta(collateralMint, fixture.svm, listing, from)
    : null;

  const [whitelistedState] = getWhitelistedState(
    globalState.publicKey,
    collateralMint,
  );

  const [nftMetadata] = getNftMetadata(nftMint);

  const [vault] = getVault(globalState.publicKey);

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
  expect(Object.keys(listingState)[0]).toBe(listingState.Opened);

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

  await expectNotReverted(
    processTransaction(fixture.svm, purchaseListingTx, [from]),
  );
}
