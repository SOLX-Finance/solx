import { usePrivy } from '@privy-io/react-auth';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';

import { solanaConnection } from '@/config/connection';
import { useProfile } from '@/features/profile/hooks/useProfile';

export const useSolanaBalance = () => {
  const { user: privyUser, ready, authenticated } = usePrivy();
  const { user } = useProfile();

  const walletAddress = user?.walletAddress || privyUser?.wallet?.address || '';

  const {
    data: balance,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['solanaBalance', walletAddress, ready, authenticated],
    queryFn: async () => {
      if (!walletAddress || !ready || !authenticated) {
        return null;
      }

      const pubkey = new PublicKey(walletAddress);
      const balanceInLamports = await solanaConnection.getBalance(pubkey);
      return balanceInLamports / LAMPORTS_PER_SOL;
    },
    enabled: Boolean(walletAddress) && ready && authenticated,
    refetchInterval: 30000,
    refetchIntervalInBackground: true,
    staleTime: 10000,
  });

  return {
    balance,
    isLoading,
    error,
  };
};
