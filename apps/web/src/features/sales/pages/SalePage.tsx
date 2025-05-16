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
  const priceSol = sale.priceUsd ? Number(sale.priceUsd) : 0;
  let canBuy = true;
  let insufficientBalanceMessage = '';

  if (isBalanceLoading) {
    canBuy = false;
    insufficientBalanceMessage = 'Checking your SOL balance...';
  } else if (balanceError) {
    canBuy = false;
    insufficientBalanceMessage = 'Failed to fetch SOL balance.';
  } else if (typeof solBalance === 'number' && priceSol > solBalance) {
    canBuy = false;
    insufficientBalanceMessage = `Insufficient SOL balance. You have ${solBalance?.toFixed(4) ?? '0.0000'} SOL, but the price is ${priceSol} SOL.`;
  }

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
            isLoadingPurchase={isPurchasePending}
            isLoadingDemo={isDemoUrlLoading}
            canBuy={canBuy}
            insufficientBalanceMessage={insufficientBalanceMessage}
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
