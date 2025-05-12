import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { PublicKey, Transaction } from '@solana/web3.js';

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
} from '../common/common.helpers';
import { processTransaction } from '../common/utils';
import { METADATA_PROGRAM_ID, SOL_MINT } from '../constants/constants';
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

  const createListingTx = new Transaction().add(
    await program.methods
      .createListing(
        Array.from(listingIdBytes),
        name,
        symbol,
        uri,
        toBN(collateralAmount),
        toBN(price),
      )
      .accounts({
        lister: from.publicKey,
        payer: from.publicKey,
        globalState: globalState.publicKey,
        globalStateAuthority: authority.publicKey,
        collateralMint,
        listing,
        listingCollateralMintAccount: listingCollateralMintAccount?.ata ?? null,
        listerCollateralMintAccount: listerCollateralMintAccount?.ata ?? null,
        whitelistedState,
        nftTokenAccount: listerNftTokenAccount,
        nftMint,
        masterEditionAccount: masterEdition,
        nftMetadata,
        metadataProgram: METADATA_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
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
};
