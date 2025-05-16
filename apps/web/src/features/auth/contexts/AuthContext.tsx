import { usePrivy, User } from '@privy-io/react-auth';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

import { httpClient } from '@/services/httpClient';

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasWallet: boolean;
  hasVerifiedEmail: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  hasWallet: false,
  hasVerifiedEmail: false,
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, authenticated, ready } = usePrivy();
  const [isLoading, setIsLoading] = useState(true);

  // Debug: Log Privy state changes
  useEffect(() => {
    console.log('[AuthContext][DEBUG] Privy state changed:', {
      ready,
      authenticated,
      user,
    });
  }, [ready, authenticated, user]);

  useEffect(() => {
    if (ready) {
      setIsLoading(false);
      console.log(
        '[AuthContext][DEBUG] Privy is ready. isLoading set to false.',
      );
    } else {
      console.log(
        '[AuthContext][DEBUG] Privy is not ready. isLoading remains true.',
      );
    }

    // Sync user with backend when authenticated
    if (ready && authenticated && user) {
      console.log('[AuthContext][DEBUG] Attempting to POST /auth/user', {
        user,
      });
      httpClient
        .post('/auth/user')
        .then(() =>
          console.log('[AuthContext][DEBUG] User synced with backend'),
        )
        .catch((error) => {
          console.error(
            '[AuthContext][ERROR] Error syncing user with backend:',
            error,
          );
        });
    } else {
      if (ready && !authenticated) {
        console.log(
          '[AuthContext][DEBUG] Privy ready but not authenticated. Skipping /auth/user POST.',
        );
      }
      if (ready && authenticated && !user) {
        console.log(
          '[AuthContext][DEBUG] Privy ready and authenticated but user is null. Skipping /auth/user POST.',
        );
      }
    }
  }, [ready, authenticated, user]);

  // Debug: Log hasWallet and hasVerifiedEmail
  const hasWallet = Boolean(user?.wallet?.address);
  const hasVerifiedEmail = Boolean(user?.email?.address);
  useEffect(() => {
    console.log(
      '[AuthContext][DEBUG] hasWallet:',
      hasWallet,
      'hasVerifiedEmail:',
      hasVerifiedEmail,
    );
  }, [hasWallet, hasVerifiedEmail]);

  // Debug: Log environment (if available)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('[AuthContext][DEBUG] Environment:', {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_ENV: process.env.VERCEL_ENV,
        API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
      });
    }
  }, []);

  const value: AuthContextValue = {
    user: user || null,
    isAuthenticated: authenticated,
    isLoading,
    hasWallet,
    hasVerifiedEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
