import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { PrivyProvider } from './privy';

import { AuthProvider } from '../features/auth';

interface AppProvidersProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <PrivyProvider>
          <AuthProvider>{children}</AuthProvider>
        </PrivyProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default AppProviders;
