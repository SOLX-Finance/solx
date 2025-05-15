import { useSolanaWallets } from '@privy-io/react-auth';
import { useSendTransaction } from '@privy-io/react-auth/solana';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { PublicKey, Transaction } from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';

import { useSolxContract } from './useSolxContract';

import { addresses } from '@/config/addresses';
import { solanaConnection } from '@/config/connection';
import {
  getCreateAssociatedTokenAccountInstruction,
  getListing,
  getNftMint,
  getWhitelistedState,
  uuidToBytes,
} from '@/utils/programs.utils';

export const useCloseSale = () => {
  const { wallets, ready } = useSolanaWallets();

  const { solxProgram } = useSolxContract();
  const { sendTransaction } = useSendTransaction();

  const {
    mutate: closeSale,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({
      uuid,
      collateralMint,
      paymentMint,
    }: {
      collateralAmount: bigint;
      price: bigint;
      uuid: string;
      collateralMint: PublicKey;
      paymentMint: PublicKey;
    }) => {
      if (!ready || !wallets.length) return;
      const wallet = wallets[0];
      const payer = new PublicKey(wallet.address);
      const globalStatePubkey = addresses.devnet.globalState;
      const treasury = addresses.devnet.treasury;
      const authority = addresses.devnet.authority;

      const connection = solanaConnection;

      const listingIdBytes = uuidToBytes(uuid);

      const [nftMint] = getNftMint(globalStatePubkey, listingIdBytes);

      const [listing] = getListing(globalStatePubkey, nftMint);

      const listingCollateralMintAccount =
        await getCreateAssociatedTokenAccountInstruction(
          connection,
          collateralMint,
          payer,
          listing,
          true,
        );

      const listingPaymentMintAccount = paymentMint
        ? await getCreateAssociatedTokenAccountInstruction(
            connection,
            paymentMint,
            payer,
            listing,
            true,
          )
        : null;

      const authorityCollateralMintAccount =
        await getCreateAssociatedTokenAccountInstruction(
          connection,
          collateralMint,
          payer,
          payer,
          true,
        );

      const authorityPaymentMintAccount = paymentMint
        ? await getCreateAssociatedTokenAccountInstruction(
            connection,
            paymentMint,
            payer,
            payer,
            true,
          )
        : null;

      const treasuryPaymentMintAccount = paymentMint
        ? await getCreateAssociatedTokenAccountInstruction(
            connection,
            paymentMint,
            payer,
            treasury,
            true,
          )
        : null;

      const [collateralWhitelistedState] = getWhitelistedState(
        globalStatePubkey,
        collateralMint,
      );

      const paymentWhitelistedState = paymentMint
        ? getWhitelistedState(globalStatePubkey, paymentMint)
        : null;

      const listerNftTokenAccount = getAssociatedTokenAddressSync(
        nftMint,
        payer,
        true,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      );

      const closeListingTx = new Transaction().add(
        await solxProgram.methods
          .closeListing(Array.from(listingIdBytes))
          .accounts({
            authority,
            globalState: globalStatePubkey,
            listing,
            listingCollateralMintAccount: listingCollateralMintAccount.ata,
            listingPaymentMintAccount:
              listingPaymentMintAccount?.ata ?? undefined,
            authorityCollateralMintAccount: authorityCollateralMintAccount.ata,
            authorityPaymentMintAccount:
              authorityPaymentMintAccount?.ata ?? null,
            treasuryPaymentMintAccount: treasuryPaymentMintAccount?.ata ?? null,
            collateralMint: collateralMint,
            paymentMint: paymentMint,
            collateralWhitelistedState: collateralWhitelistedState,
            paymentWhitelistedState: paymentWhitelistedState?.[0] ?? null,
            nftMint,
            nftTokenAccount: listerNftTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            tokenProgram2022: TOKEN_2022_PROGRAM_ID,
            treasury,
          })
          .transaction(),
      );

      const tx = new Transaction().add(closeListingTx);

      const receipt = await sendTransaction({
        connection: connection,
        transaction: tx,
        address: payer.toBase58(),
      });

      await connection.confirmTransaction(receipt.signature, 'finalized');
    },
  });

  return {
    closeSale,
    isPending,
    isError,
    error,
  };
};
