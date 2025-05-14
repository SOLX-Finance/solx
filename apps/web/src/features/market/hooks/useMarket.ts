import { useQuery } from '@tanstack/react-query';

import { getActiveSales, Sale } from '../../sales/api/salesApi';

const ACTIVE_SALES_QUERY_KEY = 'activeSales';

export const useMarket = () => {
  const {
    data: sales,
    isLoading,
    error,
    refetch,
  } = useQuery<Sale[]>({
    queryKey: [ACTIVE_SALES_QUERY_KEY],
    queryFn: getActiveSales,
  });

  return {
    sales: sales || [],
    isLoading,
    error: error ? (error as Error).message : null,
    refetchSales: refetch,
  };
};
