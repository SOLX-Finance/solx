import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import {
  getUserSales,
  GetSalesByUserResponse,
} from '@/features/sales/api/salesApi';

export type SalesFilter = 'created' | 'bought';

export const useUserSales = (
  walletAddress: string,
  filter: SalesFilter = 'created',
) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);

  const { data, isLoading, error, refetch } = useQuery<GetSalesByUserResponse>({
    queryKey: ['userSales', walletAddress, filter, page, limit],
    queryFn: () => getUserSales(walletAddress, page, limit),
    enabled: !!walletAddress,
  });

  const handleNextPage = () => {
    if (data && page < data.totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    if (data && pageNumber >= 1 && pageNumber <= data.totalPages) {
      setPage(pageNumber);
    }
  };

  const changeLimit = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  return {
    sales: data?.sales || [],
    total: data?.total || 0,
    currentPage: data?.page || page,
    totalPages: data?.totalPages || 0,
    limit: data?.limit || limit,
    isLoading,
    error: error ? (error as Error).message : null,
    refetch,
    handleNextPage,
    handlePrevPage,
    goToPage,
    changeLimit,
  };
};
