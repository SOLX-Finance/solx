import { User } from '@privy-io/react-auth';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

import usePrivy from '../../../hooks/usePrivy';

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

  useEffect(() => {
    if (ready) {
      setIsLoading(false);
    }
  }, [ready]);

  const hasWallet = Boolean(user?.wallet?.address);
  const hasVerifiedEmail = Boolean(user?.email?.address);

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
