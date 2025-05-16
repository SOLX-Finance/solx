import { useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';

import { Sale, salesApi } from '@/features/sales/api/salesApi';

export type MarketFilters = {
  search?: string;
  sortBy?: 'newest' | 'price-low' | 'price-high';
  categories?: string[];
  page: number;
  limit: number;
};

export const useMarket = (initialFilters?: Partial<MarketFilters>) => {
  const [filters, setFilters] = useState<MarketFilters>({
    page: initialFilters?.page || 1,
    limit: initialFilters?.limit || 8,
    search: initialFilters?.search || '',
    sortBy: initialFilters?.sortBy || 'newest',
    categories: initialFilters?.categories || [],
  });

  const apiFilters = {
    ...filters,
    search: filters.search || undefined,
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['sales', 'active', apiFilters],
    queryFn: () => salesApi.getActiveSales(apiFilters),
  });

  const handleSearch = useCallback((search: string) => {
    setFilters((prev) => ({
      ...prev,
      search: search.trim(),
      page: 1,
    }));
  }, []);

  const handleSort = useCallback(
    (sortBy: 'newest' | 'price-low' | 'price-high') => {
      setFilters((prev) => ({ ...prev, sortBy }));
    },
    [],
  );

  const handleFilter = useCallback((categories: string[]) => {
    setFilters((prev) => ({ ...prev, categories, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handleLimitChange = useCallback((limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  return {
    sales: data?.sales ?? [],
    total: data?.total || 5,
    currentPage: filters.page,
    totalPages: data?.totalPages || 1,
    limit: filters.limit,
    filters: apiFilters,
    isLoading,
    error,
    refetch,
    handleSearch,
    handleSort,
    handleFilter,
    handlePageChange,
    handleLimitChange,
  };
};
