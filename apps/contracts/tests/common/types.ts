import { AccountInfo, PublicKey } from '@solana/web3.js';
import { AccountInfoBytes } from 'litesvm';

export interface AddedAccount {
  address: PublicKey;
  info: AccountInfoBytes;
}
