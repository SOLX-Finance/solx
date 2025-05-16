import {
  PrivyProvider as PrivyAuthProvider,
  PrivyProviderProps,
} from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';
import { ReactNode } from 'react';

import { env } from '../../config/env';

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
      { name: 'mainnet-beta', rpcUrl: 'https://api.mainnet-beta.solana.com' },
      { name: 'devnet', rpcUrl: 'https://api.devnet.solana.com' },
    ],
    embeddedWallets: {
      solana: {
        createOnLogin: 'users-without-wallets',
      },
    },
    externalWallets: {
      walletConnect: { enabled: true },
      solana: {
        connectors: toSolanaWalletConnectors({ shouldAutoConnect: true }),
      },
    },
  },
};

const PrivyProvider = ({ children }: { children: ReactNode }) => {
  return <PrivyAuthProvider {...config}>{children}</PrivyAuthProvider>;
};

export default PrivyProvider;
