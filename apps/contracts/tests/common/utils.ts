import { Keypair, Signer, Transaction } from '@solana/web3.js';
import { FailedTransactionMetadata, LiteSVM } from 'litesvm';

let latestSlot = 0n;
let sec = 0n;
export const processTransaction = async (
  svm: LiteSVM,
  transaction: Transaction,
  signers: (Keypair | Signer)[],
) => {
  latestSlot = BigInt(latestSlot) + 1n;
  svm.warpToSlot(latestSlot);

  const blockHash = svm.latestBlockhash();

  const newClock = svm.getClock();
  newClock.unixTimestamp = BigInt(1742987870) + sec;
  svm.setClock(newClock);

  sec++;

  transaction.recentBlockhash = blockHash;
  transaction.sign(...signers);

  const meta = svm.sendTransaction(transaction);

  if (meta instanceof FailedTransactionMetadata) {
    throw new Error(meta.toString());
  }

  return Buffer.from(meta.signature()).toString('hex');
};
