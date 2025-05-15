import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useMemo } from 'react';

import { SalesFilter } from '../hooks/useUserSales';

import { ProjectCard } from '@/components/common/ProjectCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { env } from '@/config/env';
import { Sale } from '@/features/sales/api/salesApi';

interface FilterableSalesProps {
  walletAddress: string;
  activeTab: SalesFilter;
  sales: Sale[];
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  total: number;
  limit: number;
}

type SortOption = 'newest' | 'price-low' | 'price-high';

export const FilterableSales = ({
  walletAddress,
  activeTab,
  sales,
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
  onPageChange,
  onLimitChange,
  total,
  limit,
}: FilterableSalesProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<string>('all');

  console.log('sales ==>', sales);

  const filteredSales = useMemo(() => {
    // Step 1: Filter by tab (created/bought)
    let result = [...sales];

    if (activeTab === 'created') {
      result = result.filter((sale) => sale.creator === walletAddress);
    } else if (activeTab === 'bought') {
      result = result.filter((sale) => sale.buyer === walletAddress);
    }

    // Step 2: Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (sale) =>
          (sale.title?.toLowerCase() || '').includes(query) ||
          (sale.description?.toLowerCase() || '').includes(query),
      );
    }

    // Step 3: Apply sorting
    return [...result].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case 'price-low':
          return parseFloat(a.priceUsd || '0') - parseFloat(b.priceUsd || '0');
        case 'price-high':
          return parseFloat(b.priceUsd || '0') - parseFloat(a.priceUsd || '0');
        default:
          return 0;
      }
    });
  }, [sales, activeTab, walletAddress, searchQuery, sortBy]);

  const filterTags = useMemo(() => ['all'], []);

  const paginationNumbers = useMemo(() => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        end = Math.min(maxPagesToShow - 1, totalPages - 1);
      } else if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - maxPagesToShow + 2);
      }

      if (start > 2) {
        pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('...');
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  const emptyStateMessage =
    activeTab === 'created'
      ? 'Create your first sale!'
      : 'Buy your first item!';

  const renderPaginationItem = (page: number | string, index: number) => {
    if (page === '...') {
      return (
        <span key={`ellipsis-${index}`} className="px-3 py-2">
          ...
        </span>
      );
    }

    return (
      <Button
        key={`page-${page}`}
        variant={currentPage === page ? 'default' : 'outline'}
        className="rounded-none border-x-0"
        onClick={() => typeof page === 'number' && onPageChange(page)}
      >
        {page}
      </Button>
    );
  };

  return (
    <div className="flex flex-col gap-[40px]">
      {/* Filters and Search */}
      <div className="flex items-center gap-[10px]">
        <Input
          className="rounded-[30px] w-[600px]"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as SortOption)}
        >
          <SelectTrigger className="w-[260px] rounded-[30px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterBy} onValueChange={setFilterBy}>
          <SelectTrigger className="w-[180px] rounded-[30px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            {filterTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sales Grid or Empty State */}
      {filteredSales.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No sales found. {emptyStateMessage}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-6">
            {filteredSales.map((sale) => {
              const previewFile = sale.files?.find(
                (file) => file.type === 'SALE_PREVIEW',
              );
              const firstFile = sale.files?.[0];
              const imageUrl =
                sale.files && sale.files.length > 0
                  ? `${env.api.url}/storage/${previewFile?.id || firstFile?.id || ''}`
                  : '';

              return (
                <ProjectCard
                  key={sale.id}
                  id={sale.id}
                  title={sale.title || ''}
                  description={sale.description || ''}
                  price={`${sale.priceUsd}`}
                  image={imageUrl}
                  tags={[]}
                  isAudited={false}
                />
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {filteredSales.length} of {total} items
            </div>

            <div className="flex items-center gap-2">
              {/* Items per page selector */}
              <Select
                value={limit.toString()}
                onValueChange={(value) => onLimitChange(parseInt(value))}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9">9 per page</SelectItem>
                  <SelectItem value="18">18 per page</SelectItem>
                  <SelectItem value="27">27 per page</SelectItem>
                  <SelectItem value="36">36 per page</SelectItem>
                </SelectContent>
              </Select>

              {/* Page navigation */}
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onPrevPage}
                  disabled={currentPage === 1}
                  className="rounded-l-full"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {paginationNumbers.map(renderPaginationItem)}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={onNextPage}
                  disabled={currentPage === totalPages}
                  className="rounded-r-full"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FilterableSales;
