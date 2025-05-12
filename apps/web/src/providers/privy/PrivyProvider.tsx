import {
  PrivyProvider as PrivyAuthProvider,
  PrivyProviderProps,
} from '@privy-io/react-auth';
import { ReactNode } from 'react';

import { env } from '../../config/env';

const PrivyProvider = ({ children }: { children: ReactNode }) => {
  const config: Omit<PrivyProviderProps, 'children'> = {
    appId: env.privy.appId,
    clientId: env.privy.clientId,

    config: {
      appearance: {
        theme: 'light',
        accentColor: '#3182ce',
        logo: '/logo.svg',
      },

      loginMethods: ['email', 'wallet'],
      embeddedWallets: {
        solana: {
          createOnLogin: 'users-without-wallets',
        },
      },
    },
  };

  return <PrivyAuthProvider {...config}>{children}</PrivyAuthProvider>;
};

export default PrivyProvider;
