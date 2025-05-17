import React from 'react';

import { Spinner } from '@/components/ui/spinner';

interface ActionButtonsProps {
  hasBuyer: boolean;
  hasDemoFile: boolean;
  hasContentFile?: boolean;
  isSeller?: boolean;
  isBuyer?: boolean;
  onPurchase: () => void;
  onDownloadDemo: () => void;
  onDownloadContent?: () => void;
  onCloseSale?: () => void;
  isLoadingPurchase?: boolean;
  isLoadingDemo?: boolean;
  isLoadingContent?: boolean;
  isLoadingClose?: boolean;
  canBuy?: boolean;
  canClose?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  hasBuyer,
  hasDemoFile,
  hasContentFile = false,
  isSeller = false,
  isBuyer = false,
  onPurchase,
  onDownloadDemo,
  onDownloadContent,
  onCloseSale,
  isLoadingPurchase = false,
  isLoadingDemo = false,
  isLoadingContent = false,
  isLoadingClose = false,
  canBuy = true,
  canClose = false,
}) => {
  return (
    <div className="flex gap-5 flex-col md:flex-row flex-wrap">
      {/* Buy button - only show if no buyer and user is not the seller */}
      {!hasBuyer && !isSeller && (
        <div className="flex flex-col items-start w-full">
          <button
            onClick={onPurchase}
            disabled={isLoadingPurchase || !canBuy}
            className="bg-[#C4E703] min-h-[54px] border border-black text-black font-medium text-xl md:text-2xl py-1.5 px-4 md:py-2.5 md:px-10 rounded-full hover:bg-[#d1f033] transition-colors flex items-center justify-center relative disabled:opacity-60 disabled:cursor-not-allowed w-full"
          >
            {isLoadingPurchase ? (
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <Spinner size="small" />
              </span>
            ) : (
              'Buy'
            )}
          </button>
        </div>
      )}

      {/* Close listing button - only show if seller and can close */}
      {isSeller && canClose && (
        <button
          onClick={onCloseSale}
          disabled={isLoadingClose}
          className="bg-red-500 min-h-[54px] border border-black text-white font-medium text-xl md:text-2xl py-1.5 px-4 md:py-2.5 md:px-10 rounded-full hover:bg-red-600 transition-colors flex items-center justify-center relative disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoadingClose ? (
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Spinner size="small" />
            </span>
          ) : (
            'Close Listing'
          )}
        </button>
      )}

      {/* Download content button - only show for buyer */}
      {isBuyer && hasContentFile && (
        <button
          onClick={onDownloadContent}
          disabled={isLoadingContent}
          className="bg-[#3B82F6] min-h-[54px] border border-black text-white font-medium text-xl md:text-2xl py-1.5 px-4 md:py-2.5 md:px-10 rounded-full hover:bg-[#2563EB] transition-colors flex items-center justify-center relative disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoadingContent ? (
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Spinner size="small" />
            </span>
          ) : (
            'Download Content'
          )}
        </button>
      )}

      {/* Demo button */}
      {hasDemoFile && (
        <button
          onClick={onDownloadDemo}
          disabled={isLoadingDemo}
          className="border border-black min-h-[54px] text-black font-medium text-xl md:text-2xl py-1.5 px-4 md:py-2.5 md:px-10 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center relative"
        >
          {isLoadingDemo ? (
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Spinner size="small" />
            </span>
          ) : (
            'Download Demo'
          )}
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
