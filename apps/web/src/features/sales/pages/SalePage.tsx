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
import { useSolanaBalance } from '@/hooks/useSolanaBalance';
import { formatUnits } from '@/utils/format-sol-utils';
import { isDefined } from '@/utils/is-defined';
import { SOL_MINT } from '@/utils/programs.utils';

const SalePage = () => {
  const navigate = useNavigate();
  const { saleId } = useParams<{ saleId: string }>();
  const { sale, isLoading, error, previewFile, demoFile } = useSale(saleId);

  const { url: demoUrl, isLoading: isDemoUrlLoading } = usePublicReadFileUrl({
    fileId: demoFile?.id,
    enabled: !!demoFile,
  });

  const { purchaseSale, isPending: isPurchasePending } = usePurchaseSale();
  const {
    balance: solBalance,
    isLoading: isBalanceLoading,
    error: balanceError,
  } = useSolanaBalance();

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!sale) return <NotFoundState />;

  // Convert priceUsd (string) to SOL (number)
  const priceSol = sale.priceUsd ? parseFloat(formatUnits(sale.priceUsd)) : 0;
  const canBuy =
    !isBalanceLoading &&
    !balanceError &&
    typeof solBalance === 'number' &&
    priceSol <= solBalance;

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
            whatYouWillGet={sale.whatYouWillGet}
          />

          {/* Action buttons */}
          <ActionButtons
            hasBuyer={!!sale.buyer}
            hasDemoFile={!!demoFile}
            onPurchase={onPurchaseSale}
            onDownloadDemo={onDownloadDemo}
            isLoadingPurchase={isPurchasePending}
            isLoadingDemo={isDemoUrlLoading}
            canBuy={canBuy}
          />
        </div>
      </div>

      {/* Creator section */}
      <div className="space-y-10">
        {isDefined(sale.whatYouWillGet) ? (
          <ContentInfo userWillGet={sale.whatYouWillGet} />
        ) : null}
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
