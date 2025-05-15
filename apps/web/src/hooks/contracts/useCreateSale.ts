import { useSolanaWallets } from '@privy-io/react-auth';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';

import { useSolxContract } from './useSolxContract';

import { addresses } from '@/config/addresses';
import { solanaConnection } from '@/config/connection';
import {
  getCreateAssociatedTokenAccountInstruction,
  getListing,
  getMasterEditionAccount,
  getNftMetadata,
  getNftMint,
  getVault,
  getWhitelistedState,
  METADATA_PROGRAM_ID,
  SOL_MINT,
  toBN,
  uuidToBytes,
} from '@/utils/programs.utils';

export const useCreateSale = () => {
  const { wallets, ready } = useSolanaWallets();

  const { solxProgram } = useSolxContract();

  const {
    mutateAsync: createSale,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({
      collateralAmount,
      price,
      uuid,
      collateralMint,
    }: {
      collateralAmount: bigint;
      price: bigint;
      uuid: string;
      collateralMint: PublicKey;
    }) => {
      if (!ready) throw new Error('Wallet connection is not ready yet');

      const wallet = wallets[0];
      if (!wallet?.address) throw new Error('Invalid wallet or wallet address');

      const payer = new PublicKey(wallet.address);
      const globalStatePubkey = addresses.devnet.globalState;
      // const globalStateAuthority = addresses.devnet.authority;

      const connection = solanaConnection;

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
        payer,
        true,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      );

      let payerCollateralAta = null;
      let listingCollateralAta = null;

      if (!collateralMint.equals(SOL_MINT)) {
        // For non-SOL tokens, create associated token accounts
        payerCollateralAta = await getCreateAssociatedTokenAccountInstruction(
          connection,
          collateralMint,
          payer,
          payer,
          true,
        );

        listingCollateralAta = await getCreateAssociatedTokenAccountInstruction(
          connection,
          collateralMint,
          payer,
          listingPda,
          true,
        );
      }

      const mintIx = await solxProgram.methods
        .mintNft(Array.from(listingIdBytes), 'SOLX Project', 'SOLX', '')
        .accounts({
          payer,
          lister: payer,
          globalState: globalStatePubkey,
          vault,
          nftMint,
          nftTokenAccount: payerNftAta,
          masterEditionAccount: masterEdition,
          nftMetadata,
          metadataProgram: METADATA_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
          systemProgram: SystemProgram.programId,
        })
        .instruction();

      const listingAccounts = {
        lister: payer,
        globalState: globalStatePubkey,
        collateralMint,
        listing: listingPda,
        whitelistedState,
        nftTokenAccount: payerNftAta,
        nftMint,
        tokenProgram: TOKEN_PROGRAM_ID,
      };

      // Add token-specific accounts if not using SOL
      if (!collateralMint.equals(SOL_MINT)) {
        Object.assign(listingAccounts, {
          listingCollateralMintAccount: listingCollateralAta?.ata,
          listerCollateralMintAccount: payerCollateralAta?.ata,
        });
      } else {
        // For SOL, use payer and listing PDA as the accounts
        Object.assign(listingAccounts, {
          listingCollateralMintAccount: null,
          listerCollateralMintAccount: null,
        });
      }

      const listIx = await solxProgram.methods
        .createListing(
          Array.from(listingIdBytes),
          toBN(collateralAmount),
          toBN(price),
        )
        .accounts(listingAccounts)
        .instruction();

      const tx = new Transaction();

      if (payerCollateralAta?.createInx) {
        tx.add(payerCollateralAta.createInx);
      }

      if (listingCollateralAta?.createInx) {
        tx.add(listingCollateralAta.createInx);
      }

      tx.add(mintIx, listIx);

      tx.feePayer = payer;
      tx.recentBlockhash = (
        await connection.getLatestBlockhash('finalized')
      ).blockhash;

      const receipt = await wallet.signTransaction(tx);
      const data = await connection.sendRawTransaction(receipt.serialize());

      return data;
    },
  });

  return {
    createSale,
    isPending,
    isError,
    error,
  };
};
