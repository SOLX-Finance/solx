import React, { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { PrivyProvider } from './privy';

import { AuthProvider } from '../features/auth';

interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <BrowserRouter>
      <PrivyProvider>
        <AuthProvider>{children}</AuthProvider>
      </PrivyProvider>
    </BrowserRouter>
  );
};

export default AppProviders;
