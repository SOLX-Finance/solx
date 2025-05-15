import { useSolanaWallets } from '@privy-io/react-auth';
import { useSendTransaction } from '@privy-io/react-auth/solana';
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';
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
  getPaymentMintState,
  getVault,
  getWhitelistedState,
  METADATA_PROGRAM_ID,
  PYTH_PRICE_UPDATE,
  SOL_MINT,
  toBN,
  uuidToBytes,
} from '@/utils/programs.utils';

export const usePurchaseSale = () => {
  const { wallets, ready } = useSolanaWallets();

  const { solxProgram } = useSolxContract();
  const { sendTransaction } = useSendTransaction();

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
    },
  });

  return {
    purchaseSale,
    isPending,
    isError,
    error,
  };
};
