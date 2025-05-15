import { useState } from 'react';

import { Banner } from '../components/banner';
import { Categories } from '../components/categories';
import { useMarket } from '../hooks/useMarket';

import { Pagination } from '@/components/common/Pagination';
import { SalesGrid } from '@/components/common/SalesGrid';
import {
  SearchAndFilter,
  SortOption,
} from '@/components/common/SearchAndFilter';
import { Spinner } from '@/components/ui/spinner';

const MarketPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const {
    sales,
    total,
    currentPage,
    totalPages,
    limit,
    isLoading,
    error,
    handleSearch,
    handleSort,
    handleFilter,
    handlePageChange,
    handleLimitChange,
  } = useMarket({
    page: 1,
    limit: 8,
  });

  const onSearchChange = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  const onSortChange = (value: string) => {
    setSortBy(value as SortOption);
    handleSort(value as SortOption);
  };

  const onFilterChange = (value: string) => {
    setFilterBy(value);
    handleFilter(value);
  };

  const filterOptions = [{ value: 'all', label: 'All' }];

  return (
    <div className="container mx-auto p-4 flex flex-col gap-[20px]">
      <Banner />
      <Categories />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Discover</h1>
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          sortBy={sortBy}
          onSortChange={onSortChange}
          filterBy={filterBy}
          onFilterChange={onFilterChange}
          filterOptions={filterOptions}
          className="w-auto"
        />
      </div>

      <SalesGrid sales={sales} columns={4} />

      <Pagination
        isHidden={sales.length === 0}
        currentPage={currentPage}
        totalPages={totalPages}
        onNextPage={() => handlePageChange(currentPage + 1)}
        onPrevPage={() => handlePageChange(currentPage - 1)}
        onPageChange={handlePageChange}
        totalItems={total}
        itemsShown={sales.length}
        pageSizeOptions={[8, 16, 24, 32]}
        showItemsPerPage={true}
        itemsPerPage={limit}
        onItemsPerPageChange={handleLimitChange}
      />
    </div>
  );
};

export default MarketPage;
