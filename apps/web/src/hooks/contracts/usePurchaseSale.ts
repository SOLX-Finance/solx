import { useSolanaWallets } from '@privy-io/react-auth';
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, Transaction } from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';

import { useSolxContract } from './useSolxContract';

import { showToast } from '@/components/ui/toaster';
import { addresses } from '@/config/addresses';
import { solanaConnection } from '@/config/connection';
import {
  getCreateAssociatedTokenAccountInstruction,
  getListing,
  getNftMint,
  getPaymentMintState,
  getWhitelistedState,
  PYTH_PRICE_UPDATE,
  uuidToBytes,
} from '@/utils/programs.utils';

export const usePurchaseSale = () => {
  const { wallets, ready } = useSolanaWallets();

  const { solxProgram } = useSolxContract();

  const {
    mutate: purchaseSale,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({
      uuid,
      paymentMint,
    }: {
      uuid: string;
      paymentMint: PublicKey;
    }) => {
      if (!ready || !wallets.length) return;
      const wallet = wallets[0];
      const payer = new PublicKey(wallet.address);
      const globalStatePubkey = addresses.devnet.globalState;

      const connection = solanaConnection;

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

      const buyerPaymentAta = await getCreateAssociatedTokenAccountInstruction(
        connection,
        paymentMint,
        payer,
        payer,
        true,
      );

      const listingPaymentAta =
        await getCreateAssociatedTokenAccountInstruction(
          connection,
          paymentMint,
          payer,
          listingPda,
          true,
        );

      const purchaseIx = await solxProgram.methods
        .purchase(Array.from(listingIdBytes))
        .accounts({
          buyer: payer,
          globalState: globalStatePubkey,
          listing: listingPda,
          nftMint,
          listingPaymentMintAccount: listingPaymentAta.ata,
          buyerPaymentMintAccount: buyerPaymentAta.ata,
          whitelistedState,
          paymentMintState,
          priceUpdate: PYTH_PRICE_UPDATE,
          paymentMint,
          tokenProgram: TOKEN_PROGRAM_ID,
          tokenProgram2022: TOKEN_2022_PROGRAM_ID,
        })
        .transaction();

      const tx = new Transaction();

      if (buyerPaymentAta?.createInx) {
        tx.add(buyerPaymentAta.createInx);
      }

      if (listingPaymentAta?.createInx) {
        tx.add(listingPaymentAta.createInx);
      }

      tx.add(purchaseIx);

      tx.feePayer = payer;
      tx.recentBlockhash = (
        await connection.getLatestBlockhash('finalized')
      ).blockhash;

      const receipt = await wallet.signTransaction(tx);
      console.log('receipt ==>', receipt);
      const data = await connection.sendRawTransaction(receipt.serialize());
      console.log('data ==>', data);

      return data;
    },
    onMutate: () => {
      showToast({
        type: 'info',
        title: 'Transaction Started',
        description: 'Purchase transaction is being processed.',
      });
    },
    onSuccess: () => {
      showToast({
        type: 'success',
        title: 'Transaction Success!',
        description: 'Your purchase was successful.',
      });
    },
    onError: (err: unknown) => {
      let message = 'Purchase failed. Please try again.';
      if (err instanceof Error) message = err.message;
      else if (typeof err === 'string') message = err;
      showToast({
        type: 'error',
        title: 'Transaction Failed',
        description: message,
      });
    },
  });

  return {
    purchaseSale,
    isPending,
    isError,
    error,
  };
};
