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
      solx: new PublicKey('8jbXs1fR9Bm5dh7N6Dr4ySsZWEeHeKTgsTYFjL386bcN'),
    },
    globalStates: {
      default: new PublicKey('6r8DxfB89V3zPBDt6pW1DL3r946sjP1bKs58vXN3896c'),
    },
  },
} as const;
