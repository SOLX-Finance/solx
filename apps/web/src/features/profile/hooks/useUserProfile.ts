import { useQuery } from '@tanstack/react-query';

import { getUserByWalletAddress } from '../api/profileApi';

export const useUserProfile = (walletAddress: string) => {
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['user', walletAddress],
    queryFn: () => getUserByWalletAddress(walletAddress),
    enabled: !!walletAddress,
  });

  return {
    user,
    isLoading,
    error: error ? (error as Error).message : null,
    refetchProfile: refetch,
  };
};
