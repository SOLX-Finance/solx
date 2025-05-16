import {
  PrivyProvider as PrivyAuthProvider,
  PrivyProviderProps,
} from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';
import { ReactNode } from 'react';

import { env } from '../../config/env';

const PrivyProvider = ({ children }: { children: ReactNode }) => {
  const config: Omit<PrivyProviderProps, 'children'> = {
    appId: env.privy.appId,
    clientId: env.privy.clientId,

    config: {
      appearance: {
        theme: 'light',
        accentColor: '#C4E703',
        logo: '/logo.svg',
        walletChainType: 'solana-only',
      },

      loginMethods: ['email', 'wallet'],
      solanaClusters: [
        { name: 'mainnet-beta', rpcUrl: 'https://solana.drpc.org' },
        { name: 'devnet', rpcUrl: 'https://solana-devnet.drpc.org' },
      ],
      embeddedWallets: {
        solana: {
          createOnLogin: 'users-without-wallets',
        },
      },
      externalWallets: {
        solana: { connectors: toSolanaWalletConnectors() },
      },
    },
  };

  return <PrivyAuthProvider {...config}>{children}</PrivyAuthProvider>;
};

export default PrivyProvider;
