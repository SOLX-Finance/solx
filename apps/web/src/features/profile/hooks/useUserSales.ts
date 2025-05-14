import { useQuery } from '@tanstack/react-query';

import { getUserSales } from '../api/profileApi';

import { Sale } from '@/features/sales/api/salesApi';

const USER_SALES_QUERY_KEY = 'userSales';

export const useUserSales = (walletAddress: string) => {
  const {
    data: sales,
    isLoading,
    error,
    refetch,
  } = useQuery<Sale[]>({
    queryKey: [USER_SALES_QUERY_KEY, walletAddress],
    queryFn: () => getUserSales(walletAddress),
    enabled: !!walletAddress, // Only run the query if walletAddress is provided
  });

  return {
    sales: sales || [],
    isLoading,
    error: error ? (error as Error).message : null,
    refetchSales: refetch,
  };
};
