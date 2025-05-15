import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { salesApi, UserSalesFilters } from '@/features/sales/api/salesApi';

export type SalesFilter = 'created' | 'bought';

export const useUserSales = (
  walletAddress: string,
  initialFilter: SalesFilter = 'created',
  initialPage = 1,
  initialLimit = 9,
) => {
  const [activeFilter, setActiveFilter] = useState<SalesFilter>(initialFilter);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('newest');

  const filters: UserSalesFilters = {
    page: currentPage,
    limit,
    search: searchQuery || undefined,
    sortBy,
    filter: activeFilter,
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['userSales', walletAddress, filters],
    queryFn: () => salesApi.getSalesByUser(walletAddress, filters),
    enabled: !!walletAddress,
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
    activeFilter,
    setActiveFilter,
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
    refetch,
  };
};
