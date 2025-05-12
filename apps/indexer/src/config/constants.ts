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
      solx: new PublicKey('5nCJ7xpgDfsSpcnbpRZf8WadzyxwShFoK8FRrVfYcSJ5'),
    },
    globalStates: {},
  },
} as const;
