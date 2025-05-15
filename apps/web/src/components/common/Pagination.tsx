import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/utils/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  onPageChange: (page: number) => void;
  showItemsPerPage?: boolean;
  itemsPerPage?: number;
  onItemsPerPageChange?: (limit: number) => void;
  totalItems?: number;
  itemsShown?: number;
  pageSizeOptions?: number[];
  maxPagesToShow?: number;
  showTotalItems?: boolean;
  className?: string;
  isHidden?: boolean;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
  onPageChange,
  showItemsPerPage = false,
  itemsPerPage = 8,
  onItemsPerPageChange,
  totalItems = 0,
  itemsShown = 0,
  pageSizeOptions = [8, 16, 24, 32],
  maxPagesToShow = 5,
  showTotalItems = true,
  className,
  isHidden = false,
}: PaginationProps) => {
  const paginationNumbers = useMemo(() => {
    const pages = [];

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
  }, [currentPage, totalPages, maxPagesToShow]);

  const renderPaginationItem = (page: number | string, index: number) => {
    if (page === '...') {
      return (
        <div
          key={`ellipsis-${index}`}
          className="flex items-center justify-center w-[50px] h-[50px] rounded-full border border-[#C7C7C7] text-black font-normal text-[18px]"
        >
          ...
        </div>
      );
    }

    return (
      <button
        key={`page-${page}`}
        className={cn(
          'w-[50px] h-[50px] rounded-full flex items-center justify-center text-[18px] font-normal',
          currentPage === page
            ? 'border border-black'
            : 'border border-[#C7C7C7]',
        )}
        onClick={() => typeof page === 'number' && onPageChange(page)}
      >
        {page}
      </button>
    );
  };

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between mt-6 gap-4 min-h-[50px]',
        className,
      )}
    >
      <div
        className={cn('text-sm text-gray-600 sm:mr-auto', isHidden && 'hidden')}
      >
        {showTotalItems &&
          totalItems > 0 &&
          `Showing ${itemsShown} of ${totalItems} items`}
      </div>

      <div
        className={cn(
          'flex flex-row items-center justify-center',
          isHidden && 'hidden',
        )}
      >
        <div className="flex items-center gap-[10px]">
          <button
            className="w-[50px] h-[50px] rounded-full border border-[#C7C7C7] flex items-center justify-center"
            onClick={onPrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft
              className={cn(
                'h-5 w-5',
                currentPage === 1 ? 'text-[#C7C7C7]' : 'text-black',
              )}
            />
          </button>

          {paginationNumbers.map(renderPaginationItem)}

          <button
            className="w-[50px] h-[50px] rounded-full border border-[#C7C7C7] flex items-center justify-center"
            onClick={onNextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRight
              className={cn(
                'h-5 w-5',
                currentPage === totalPages ? 'text-[#C7C7C7]' : 'text-black',
              )}
            />
          </button>
        </div>
      </div>

      <div className={cn('sm:ml-auto', isHidden && 'hidden')}>
        {showItemsPerPage &&
          onItemsPerPageChange &&
          pageSizeOptions.length > 0 && (
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue>{itemsPerPage} per page</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size} per page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
      </div>
    </div>
  );
};

export default Pagination;
