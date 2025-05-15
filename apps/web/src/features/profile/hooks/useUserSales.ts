import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

import { salesApi, UserSalesFilters } from '@/features/sales/api/salesApi';

export type SalesFilter = 'created' | 'bought';

export const useUserSales = ({
  walletAddress,
  initialFilter = 'created',
  initialPage = 1,
  initialLimit = 9,
}: {
  walletAddress: string;
  initialFilter: SalesFilter;
  initialPage?: number;
  initialLimit?: number;
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('newest');

  useEffect(() => {
    setCurrentPage(1);
  }, [initialFilter]);

  const filters: UserSalesFilters = {
    page: currentPage,
    limit,
    search: searchQuery || undefined,
    sortBy,
    filter: initialFilter, // Use initialFilter directly from props
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [
      'userSales',
      walletAddress,
      initialFilter,
      currentPage,
      limit,
      searchQuery,
      sortBy,
      filters,
    ],
    queryFn: () => salesApi.getSalesByUser(walletAddress, filters),
    enabled: !!walletAddress,
    refetchOnWindowFocus: false,
  });

  const handleNextPage = () => {
    if (data && currentPage < data.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const changeLimit = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  return {
    sales: data?.sales || [],
    isLoading,
    error,
    activeFilter: initialFilter,
    currentPage,
    totalPages: data?.totalPages || 1,
    total: data?.total || 0,
    limit,
    searchQuery,
    sortBy,
    handleNextPage,
    handlePrevPage,
    goToPage,
    changeLimit,
    handleSearchChange,
    handleSortChange,
  };
};
