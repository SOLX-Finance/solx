import { ProfileSalesGrid } from './ProfileSalesGrid';

import { SalesFilter } from '../hooks/useUserSales';

import { Pagination } from '@/components/common/Pagination';
import { SalesGrid } from '@/components/common/SalesGrid';
import { Spinner } from '@/components/ui/spinner';
import { Sale } from '@/features/sales/api/salesApi';

interface FilterableSalesProps {
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
  activeTab: SalesFilter;
  onDownloadContent?: (sale: Sale) => void;
  loadingContentIds?: string[];
}

export const FilterableSales = ({
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
  activeTab,
  onDownloadContent,
  loadingContentIds = [],
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
          <ProfileSalesGrid
            sales={sales}
            columns={3}
            activeTab={activeTab}
            onDownloadContent={onDownloadContent}
            loadingContentIds={loadingContentIds}
          />

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
