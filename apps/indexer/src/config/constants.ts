import { PublicKey } from '@solana/web3.js';

export type NetworkAddresses = {
  readonly programs: Record<string, PublicKey>;
  readonly globalStates: Record<string, PublicKey>;
};

export const networkAddresses: Partial<
  Record<'devnet' | 'mainnet', NetworkAddresses>
> = {
  devnet: {
    programs: {
      solx: new PublicKey('72GoG8mDsCuBMBSQZe3TmXtgQgNxuAzCh4ipgyRJqGCi'),
    },
    globalStates: {
      default: new PublicKey('H5ZkAYbKVAnm8n5p8taHhrNWvBWQyY2PabXoD6QLXCDH'),
    },
  },
} as const;
