import { usePrivy } from '@privy-io/react-auth';
import { PublicKey } from '@solana/web3.js';
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
  ContentDownload,
} from '../components/SalePage';
import { useSale } from '../hooks/useSale';

import { useCloseSale } from '@/hooks/contracts/useCloseSale';
import { usePurchaseSale } from '@/hooks/contracts/usePurchaseSale';
import { usePublicReadFileUrl } from '@/hooks/usePublicReadFileUrl';
import { useReadFileUrl } from '@/hooks/useReadFileUrl';
import { useSolanaBalance } from '@/hooks/useSolanaBalance';
import { formatUnits } from '@/utils/format-sol-utils';
import { isDefined } from '@/utils/is-defined';
import { SOL_MINT } from '@/utils/programs.utils';

interface ExtendedSale {
  expiryTs?: string;
  paymentMint?: string;
}

const SalePage = () => {
  const navigate = useNavigate();
  const { user: privyUser } = usePrivy();
  const { saleId } = useParams<{ saleId: string }>();
  const {
    sale,
    isLoading,
    error,
    previewFiles,
    demoFile,
    contentFile,
    refetchSale,
  } = useSale(saleId);

  const userAddress = privyUser?.wallet?.address || '';

  const { url: demoUrl, isLoading: isDemoUrlLoading } = usePublicReadFileUrl({
    fileId: demoFile?.id,
    enabled: !!demoFile,
  });

  const { url: contentUrl, isLoading: isContentUrlLoading } = useReadFileUrl({
    fileId: contentFile?.id,
    enabled: !!contentFile && !!userAddress && sale?.buyer === userAddress,
  });

  const { purchaseSale, isPending: isPurchasePending } = usePurchaseSale();
  const { closeSale, isPending: isClosePending } = useCloseSale();

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

  const isSeller = !!userAddress && sale.creator === userAddress;
  const isBuyer = !!userAddress && sale.buyer === userAddress;

  const now = Date.now();
  const extendedSale = sale as ExtendedSale;
  const expiryTimestamp = extendedSale.expiryTs
    ? parseInt(extendedSale.expiryTs) * 1000
    : 0;
  const hasExpired = expiryTimestamp > 0 && now > expiryTimestamp;
  const canClose = isSeller && (!sale.buyer || (!!sale.buyer && hasExpired));

  const onPurchaseSale = async () => {
    try {
      await purchaseSale({
        uuid: sale.id,
        paymentMint: SOL_MINT,
      });
      // After purchase is successful, refetch sale data to update the UI
      setTimeout(() => {
        refetchSale();
      }, 2000); // Add a slight delay to allow transaction to be processed
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  const onCloseSale = async () => {
    await closeSale({
      uuid: sale.id,
      collateralMint: new PublicKey(sale.collateralMint),
      paymentMint: sale.buyer
        ? new PublicKey(extendedSale.paymentMint || SOL_MINT.toString())
        : SOL_MINT,
      collateralAmount: BigInt(sale.collateralAmount || '0'),
      price: BigInt(sale.priceUsd || '0'),
    });
  };

  const onDownloadDemo = () => {
    if (demoUrl) {
      window.open(demoUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const onDownloadContent = () => {
    if (contentUrl) {
      window.open(contentUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="mt-5 mb-[100px]">
      <PageHeader onGoBack={() => navigate(-1)} />

      {/* Main content section */}
      <div className="flex flex-col lg:flex-row gap-10 mb-10">
        {/* Left column - Image and content */}
        <PreviewSection
          previewFiles={previewFiles}
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
            hasContentFile={!!contentFile}
            isSeller={isSeller}
            isBuyer={isBuyer}
            onPurchase={onPurchaseSale}
            onDownloadDemo={onDownloadDemo}
            onDownloadContent={onDownloadContent}
            onCloseSale={onCloseSale}
            isLoadingPurchase={isPurchasePending}
            isLoadingDemo={isDemoUrlLoading}
            isLoadingContent={isContentUrlLoading}
            isLoadingClose={isClosePending}
            canBuy={canBuy}
            canClose={canClose}
          />
        </div>
      </div>

      {/* Content sections */}
      <div className="space-y-10">
        {isDefined(sale.whatYouWillGet) ? (
          <ContentInfo userWillGet={sale.whatYouWillGet} />
        ) : null}

        <ContentDownload
          isBuyer={isBuyer}
          hasContentFile={!!contentFile}
          onDownloadContent={onDownloadContent}
          isLoading={isContentUrlLoading}
        />

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
