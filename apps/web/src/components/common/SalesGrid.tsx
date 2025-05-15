import { useMemo } from 'react';

import { ProjectCard } from '@/components/common/ProjectCard';
import { env } from '@/config/env';
import { Sale } from '@/features/sales/api/salesApi';
import { cn } from '@/utils/cn';

interface SalesGridProps {
  sales: Sale[];
  columns?: 3 | 4;
}

export const SalesGrid = ({ sales, columns = 3 }: SalesGridProps) => {
  const calculateMinHeight = useMemo(() => {
    const CARD_HEIGHT = 450;
    const GAP = 24;

    if (sales.length === 0) return '450px';

    const rows = Math.ceil(sales.length / columns);
    const totalHeight = rows * CARD_HEIGHT + (rows - 1) * GAP;

    return `${totalHeight}px`;
  }, [sales.length, columns]);

  return (
    <div
      className={cn(
        'grid gap-6 min-h-[450px]',
        columns === 3 ? 'grid-cols-3' : 'grid-cols-4',
      )}
      style={{ minHeight: calculateMinHeight }}
    >
      {sales.map((sale) => {
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
  );
};

export default SalesGrid;
