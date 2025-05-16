import { useParams, useNavigate } from 'react-router-dom';

import {
  LoadingState,
  ErrorState,
  NotFoundState,
  PageHeader,
  PreviewSection,
  SaleInfo,
  ActionButtons,
  ContentInfo,
  DemoInfo,
} from '../components/SalePage';
import { useSale } from '../hooks/useSale';

import { usePurchaseSale } from '@/hooks/contracts/usePurchaseSale';
import { usePublicReadFileUrl } from '@/hooks/usePublicReadFileUrl';
import { SOL_MINT } from '@/utils/programs.utils';

const SalePage = () => {
  const navigate = useNavigate();
  const { saleId } = useParams<{ saleId: string }>();
  const { sale, isLoading, error, previewFile, contentFile, demoFile } =
    useSale(saleId);

  const { url: demoUrl, isLoading: isDemoUrlLoading } = usePublicReadFileUrl({
    fileId: demoFile?.id,
    enabled: !!demoFile,
  });

  const { purchaseSale } = usePurchaseSale();

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!sale) return <NotFoundState />;

  const onPurchaseSale = async () => {
    await purchaseSale({
      uuid: sale.id,
      // TODO: remove hardcode
      paymentMint: SOL_MINT,
    });
  };

  const onDownloadDemo = () => {
    if (demoUrl) {
      window.open(demoUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="mt-5 mb-[100px]">
      <PageHeader onGoBack={() => navigate(-1)} />

      {/* Main content section */}
      <div className="flex flex-col lg:flex-row gap-10 mb-10">
        {/* Left column - Image and content */}
        <PreviewSection
          previewFile={previewFile}
          title={sale.title}
          isAudited={sale.isAudited}
        />

        {/* Project info */}
        <div className="flex-1 space-y-10">
          <SaleInfo
            title={sale.title}
            description={sale.description}
            categories={sale.categories || []}
            priceUsd={BigInt(sale.priceUsd ?? '0')}
          />

          {/* Action buttons */}
          <ActionButtons
            hasBuyer={!!sale.buyer}
            hasDemoFile={!!demoFile}
            onPurchase={onPurchaseSale}
            onDownloadDemo={onDownloadDemo}
          />
        </div>
      </div>

      {/* Creator section */}
      <div className="space-y-10">
        <ContentInfo hasContentFile={!!contentFile} />
        <DemoInfo
          hasDemoFile={!!demoFile}
          onDownloadDemo={onDownloadDemo}
          isLoading={isDemoUrlLoading}
        />
      </div>
    </div>
  );
};

export default SalePage;
