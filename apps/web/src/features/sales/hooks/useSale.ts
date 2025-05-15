import { useQuery } from '@tanstack/react-query';

import { salesApi, Sale } from '../api/salesApi';

const SALE_QUERY_KEY = 'sale';

export const useSale = (saleId: string | undefined) => {
  const {
    data: sale,
    isLoading,
    error,
    refetch,
  } = useQuery<Sale>({
    queryKey: [SALE_QUERY_KEY, saleId],
    queryFn: () => {
      if (!saleId) {
        throw new Error('Sale ID is missing');
      }
      return salesApi.getSaleById(saleId);
    },
    enabled: !!saleId, // Only run the query if saleId is provided
  });

  // Helper functions to find specific file types
  const getFileByType = (type: string) => {
    return sale?.files?.find((file) => file.type === type);
  };

  const previewFile = sale ? getFileByType('SALE_PREVIEW') : undefined;
  const contentFile = sale ? getFileByType('SALE_CONTENT') : undefined;
  const demoFile = sale ? getFileByType('SALE_DEMO') : undefined;

  return {
    sale,
    isLoading,
    error: error ? (error as Error).message : null,
    refetchSale: refetch,
    previewFile,
    contentFile,
    demoFile,
  };
};
