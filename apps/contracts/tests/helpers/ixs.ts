import { Program } from '@coral-xyz/anchor';
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token';
import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';

import { uuidToBytes } from './solx.helpers';

import { Solx } from '../../target/types/solx';
import { getPaymentMintState, getVault, toBN } from '../common/common.helpers';
import { getNftMetadata } from '../common/common.helpers';
import { getWhitelistedState } from '../common/common.helpers';
import { getMasterEditionAccount } from '../common/common.helpers';
import { getListing } from '../common/common.helpers';
import { getNftMint } from '../common/common.helpers';
import {
  METADATA_PROGRAM_ID,
  PYTH_PRICE_UPDATE,
  SOL_MINT,
} from '../constants/constants';

export interface CreateListingProps {
  connection: Connection;
  payer: Keypair;
  uuid: string;
  name: string;
  symbol: string;
  uri: string;
  collateralMint: PublicKey;
  collateralAmount: number;
  price: number;
  globalStatePubkey: PublicKey;
  program: Program<Solx>;
}

export interface CreateListingProps {
  connection: Connection;
  payer: Keypair;
  uuid: string;
  name: string;
  symbol: string;
  uri: string;
  collateralMint: PublicKey;
  collateralAmount: number;
  price: number;
  globalStatePubkey: PublicKey;
  globalStateAuthority: PublicKey;
  program: Program<Solx>;
}

export const createListing = async (opts: CreateListingProps) => {
  const {
    connection,
    payer,
    uuid,
    name,
    symbol,
    uri,
    collateralMint,
    collateralAmount,
    price,
    globalStatePubkey,
    globalStateAuthority,
    program,
  } = opts;

  const listingIdBytes = uuidToBytes(uuid);
  const [nftMint] = getNftMint(globalStatePubkey, listingIdBytes);
  const [listingPda] = getListing(globalStatePubkey, nftMint);
  const [masterEdition] = getMasterEditionAccount(nftMint);
  const [whitelistedState] = getWhitelistedState(
    globalStatePubkey,
    collateralMint,
  );
  const [nftMetadata] = getNftMetadata(nftMint);
  const [vault] = getVault(globalStatePubkey);

  const payerNftAta = getAssociatedTokenAddressSync(
    nftMint,
    payer.publicKey,
    true,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );

  const payerCollateralAta = collateralMint.equals(SOL_MINT)
    ? null
    : (
        await getOrCreateAssociatedTokenAccount(
          connection,
          payer,
          collateralMint,
          payer.publicKey,
          true,
        )
      ).address;

  const listingCollateralAta = collateralMint.equals(SOL_MINT)
    ? null
    : (
        await getOrCreateAssociatedTokenAccount(
          connection,
          payer,
          collateralMint,
          listingPda,
          true,
        )
      ).address;

  const mintIx = await program.methods
    .mintNft(Array.from(listingIdBytes), name, symbol, uri)
    .accounts({
      payer: payer.publicKey,
      lister: payer.publicKey,
      globalState: globalStatePubkey,
      globalStateAuthority,
      vault,
      nftMint,
      nftTokenAccount: payerNftAta,
      masterEditionAccount: masterEdition,
      nftMetadata,
      metadataProgram: METADATA_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .transaction();

  const listIx = await program.methods
    .createListing(
      Array.from(listingIdBytes),
      toBN(collateralAmount),
      toBN(price),
    )
    .accounts({
      lister: payer.publicKey,
      globalState: globalStatePubkey,
      collateralMint,
      listing: listingPda,
      listingCollateralMintAccount: listingCollateralAta,
      listerCollateralMintAccount: payerCollateralAta,
      whitelistedState,
      nftTokenAccount: payerNftAta,
      nftMint,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .transaction();

  const tx = new Transaction().add(mintIx).add(listIx);
  const sig = await sendAndConfirmTransaction(connection, tx, [payer], {
    commitment: 'confirmed',
  });

  console.log('Listing created, tx:', sig);
  return sig;
};

export interface PurchaseListingProps {
  connection: Connection;
  payer: Keypair;
  uuid: string;
  paymentMint: PublicKey;
  globalStatePubkey: PublicKey;
  program: Program<Solx>;
}

export const purchaseListing = async (opts: PurchaseListingProps) => {
  const { connection, payer, uuid, paymentMint, globalStatePubkey, program } =
    opts;

  const listingIdBytes = uuidToBytes(uuid);
  const [nftMint] = getNftMint(globalStatePubkey, listingIdBytes);
  const [listingPda] = getListing(globalStatePubkey, nftMint);

  const [whitelistedState] = getWhitelistedState(
    globalStatePubkey,
    paymentMint,
  );
  const [paymentMintState] = getPaymentMintState(
    globalStatePubkey,
    paymentMint,
  );

  const buyerPaymentAta = (
    await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      paymentMint,
      payer.publicKey,
      true,
    )
  ).address;

  const listingPaymentAta = (
    await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      paymentMint,
      listingPda,
      true,
    )
  ).address;

  const purchaseIx = await program.methods
    .purchase(Array.from(listingIdBytes))
    .accounts({
      buyer: payer.publicKey,
      globalState: globalStatePubkey,
      listing: listingPda,
      nftMint,
      listingPaymentMintAccount: listingPaymentAta,
      buyerPaymentMintAccount: buyerPaymentAta,
      whitelistedState,
      paymentMintState,
      priceUpdate: PYTH_PRICE_UPDATE,
      paymentMint,
      tokenProgram: TOKEN_PROGRAM_ID,
      tokenProgram2022: TOKEN_2022_PROGRAM_ID,
    })
    .transaction();

  const tx = new Transaction().add(purchaseIx);
  const sig = await sendAndConfirmTransaction(connection, tx, [payer], {
    commitment: 'confirmed',
  });

  console.log('Listing purchased, tx:', sig);
  return sig;
};

interface CloseListingProps {
  connection: Connection;
  payer: Keypair;
  uuid: string;
  globalState: PublicKey;
  collateralMint: PublicKey;
  paymentMint: PublicKey | null;
  treasury: PublicKey;
  program: Program<Solx>;
}

export async function closeListing(opts: CloseListingProps) {
  const {
    connection,
    payer,
    uuid,
    globalState,
    collateralMint,
    paymentMint,
    treasury,
    program,
  } = opts;

  const listingIdBytes = uuidToBytes(uuid);
  const [nftMint] = getNftMint(globalState, listingIdBytes);
  const [listing] = getListing(globalState, nftMint);

  const payerCollateralAta = (
    await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      collateralMint,
      payer.publicKey,
      true,
    )
  ).address;

  const payerPaymentAta = (
    await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      paymentMint,
      payer.publicKey,
      true,
    )
  ).address;

  const treasuryPaymentAta = (
    await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      paymentMint,
      treasury,
      true,
    )
  ).address;

  const listingCollateralAta = (
    await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      collateralMint,
      listing,
      true,
    )
  ).address;

  const listingPaymentAta = (
    await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      paymentMint,
      listing,
      true,
    )
  ).address;

  const nftTokenAccount = (
    await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      nftMint,
      payer.publicKey,
      true,
    )
  ).address;

  const [collateralWhitelistedState] = getWhitelistedState(
    globalState,
    collateralMint,
  );
  const [paymentWhitelistedState] = getWhitelistedState(
    globalState,
    paymentMint,
  );

  const closeListingIx = await program.methods
    .closeListing(Array.from(listingIdBytes))
    .accounts({
      authority: payer.publicKey,
      treasury,
      globalState,
      listing,
      listingCollateralMintAccount: listingCollateralAta,
      listingPaymentMintAccount: listingPaymentAta,
      authorityCollateralMintAccount: payerCollateralAta,
      authorityPaymentMintAccount: payerPaymentAta,
      treasuryPaymentMintAccount: treasuryPaymentAta,
      collateralMint,
      paymentMint,
      collateralWhitelistedState,
      paymentWhitelistedState,
      nftMint,
      nftTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      tokenProgram2022: TOKEN_2022_PROGRAM_ID,
    })
    .transaction();

  const tx = new Transaction().add(closeListingIx);
  const sig = await sendAndConfirmTransaction(connection, tx, [payer], {
    commitment: 'confirmed',
  });

  console.log('Listing closed, tx:', sig);
  return sig;
}
