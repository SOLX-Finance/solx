import React from 'react';

import { Spinner } from '@/components/ui/spinner';

interface ActionButtonsProps {
  hasBuyer: boolean;
  hasDemoFile: boolean;
  onPurchase: () => void;
  onDownloadDemo: () => void;
  isLoadingPurchase?: boolean;
  isLoadingDemo?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  hasBuyer,
  hasDemoFile,
  onPurchase,
  onDownloadDemo,
  isLoadingPurchase = false,
  isLoadingDemo = false,
}) => {
  return (
    <div className="flex gap-5 flex-col md:flex-row">
      {!hasBuyer && (
        <button
          onClick={onPurchase}
          disabled={isLoadingPurchase}
          className="bg-[#C4E703] min-h-[54px] border border-black text-black font-medium text-xl md:text-2xl py-1.5 px-4 md:py-2.5 md:px-10 rounded-full hover:bg-[#d1f033] transition-colors flex items-center justify-center relative"
        >
          {isLoadingPurchase ? (
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Spinner size="small" />
            </span>
          ) : (
            'Buy'
          )}
        </button>
      )}

      {hasDemoFile && (
        <button
          onClick={onDownloadDemo}
          disabled={isLoadingDemo}
          className="border border-black min-h-[54px] text-black font-medium text-2xl py-2.5 px-10 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center relative"
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
