import { useMemo } from 'react';

import { ProjectCard } from '@/components/common/ProjectCard';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { env } from '@/config/env';
import { Sale } from '@/features/sales/api/salesApi';
import { cn } from '@/utils/cn';

interface ProfileSalesGridProps {
  sales: Sale[];
  columns?: 3 | 4;
  activeTab: 'created' | 'bought';
  onDownloadContent?: (sale: Sale) => void;
  loadingContentIds?: string[];
}

export const ProfileSalesGrid = ({
  sales,
  columns = 3,
  activeTab,
  onDownloadContent,
  loadingContentIds = [],
}: ProfileSalesGridProps) => {
  const calculateMinHeight = useMemo(() => {
    const CARD_HEIGHT = 450;
    const GAP = 24;

    if (sales.length === 0) return '450px';

    const rows = Math.ceil(sales.length / columns);
    const totalHeight = rows * CARD_HEIGHT + (rows - 1) * GAP;

    return `${totalHeight}px`;
  }, [sales.length, columns]);

  if (sales.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center min-h-[450px] text-gray-500 text-xl',
        )}
        style={{ minHeight: calculateMinHeight }}
      >
        {activeTab === 'created'
          ? "You haven't created any sales yet."
          : "You haven't purchased any content yet."}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid gap-6 min-h-[450px] ',
        columns === 3
          ? 'grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1'
          : 'grid-cols-4 max-xl:!grid-cols-3 max-lg:!grid-cols-2 max-md:!grid-cols-1',
      )}
      style={{ minHeight: calculateMinHeight }}
    >
      {sales.map((sale) => {
        const previewFile = sale.files?.find(
          (file) => file.type === 'SALE_PREVIEW',
        );
        const contentFile = sale.files?.find(
          (file) => file.type === 'SALE_CONTENT',
        );
        const firstFile = sale.files?.[0];
        const imageUrl =
          sale.files && sale.files.length > 0
            ? `${env.api.url}/storage/${previewFile?.id || firstFile?.id || ''}`
            : '';

        const isDownloadable = activeTab === 'bought' && !!contentFile;
        const isDownloading = loadingContentIds.includes(sale.id);

        return (
          <div key={sale.id} className="flex flex-col">
            <ProjectCard
              id={sale.id}
              title={sale.title || ''}
              description={sale.description || ''}
              price={BigInt(sale.priceUsd ?? '0')}
              bought={!!sale.buyer}
              image={imageUrl}
              tags={sale.categories || []}
              isAudited={sale.isAudited || false}
            />
            {isDownloadable && (
              <Button
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => onDownloadContent && onDownloadContent(sale)}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <span className="flex items-center">
                    <Spinner size="small" className="mr-2" /> Generating
                    download link...
                  </span>
                ) : (
                  'Download Content'
                )}
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProfileSalesGrid;
