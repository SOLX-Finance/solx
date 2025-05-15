import { SalesFilter } from '../hooks/useUserSales';

import { Pagination } from '@/components/common/Pagination';
import { SalesGrid } from '@/components/common/SalesGrid';
import { Spinner } from '@/components/ui/spinner';
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
  isLoading: boolean;
}

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
  isLoading,
}: FilterableSalesProps) => {
  return (
    <div className="flex flex-col gap-[40px]">
      {/* Sales Grid */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : (
        <>
          <SalesGrid sales={sales} columns={3} />

          {/* Pagination */}
          <Pagination
            isHidden={sales.length === 0}
            currentPage={currentPage}
            totalPages={totalPages}
            onNextPage={onNextPage}
            onPrevPage={onPrevPage}
            onPageChange={onPageChange}
            showItemsPerPage={true}
            itemsPerPage={limit}
            onItemsPerPageChange={onLimitChange}
            totalItems={total}
            itemsShown={sales.length}
            pageSizeOptions={[6, 9, 15]}
          />
        </>
      )}
    </div>
  );
};

export default FilterableSales;
