import { useSolanaWallets } from '@privy-io/react-auth';
import { useSendTransaction } from '@privy-io/react-auth/solana';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { PublicKey, SYSVAR_RENT_PUBKEY, Transaction } from '@solana/web3.js';
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
  const { sendTransaction } = useSendTransaction();

  const {
    mutate: createSale,
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
      if (!ready || !wallets.length) return;
      const wallet = wallets[0];
      const payer = new PublicKey(wallet.address);
      const globalStatePubkey = addresses.devnet.globalState;
      const globalStateAuthority = addresses.devnet.authority;

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

      const payerCollateralAta = collateralMint.equals(SOL_MINT)
        ? null
        : await getCreateAssociatedTokenAccountInstruction(
            connection,
            collateralMint,
            payer,
            true,
          );

      const listingCollateralAta = collateralMint.equals(SOL_MINT)
        ? null
        : await getCreateAssociatedTokenAccountInstruction(
            connection,
            collateralMint,
            listingPda,
            true,
          );

      const mintIx = await solxProgram.methods
        .mintNft(Array.from(listingIdBytes), 'SOLX Project', 'SOLX', '')
        .accounts({
          payer,
          lister: payer,
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
        .instruction();

      const listIx = await solxProgram.methods
        .createListing(
          Array.from(listingIdBytes),
          toBN(collateralAmount),
          toBN(price),
        )
        .accounts({
          lister: payer,
          globalState: globalStatePubkey,
          collateralMint,
          listing: listingPda,
          listingCollateralMintAccount: listingCollateralAta?.ata,
          listerCollateralMintAccount: payerCollateralAta?.ata,
          whitelistedState,
          nftTokenAccount: payerNftAta,
          nftMint,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .instruction();

      const tx = new Transaction();

      if (payerCollateralAta?.createInx) {
        tx.add(payerCollateralAta.createInx);
      }

      if (listingCollateralAta?.createInx) {
        tx.add(listingCollateralAta.createInx);
      }

      tx.add(mintIx, listIx);

      const receipt = await sendTransaction({
        connection: connection,
        transaction: tx,
        address: payer.toBase58(),
      });

      await connection.confirmTransaction(receipt.signature, 'finalized');
    },
  });

  return {
    createSale,
    isPending,
    isError,
    error,
  };
};
