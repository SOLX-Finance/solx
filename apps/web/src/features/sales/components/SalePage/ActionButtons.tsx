import React from 'react';

interface ActionButtonsProps {
  hasBuyer: boolean;
  hasDemoFile: boolean;
  onPurchase: () => void;
  onDownloadDemo: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  hasBuyer,
  hasDemoFile,
  onPurchase,
  onDownloadDemo,
}) => {
  return (
    <div className="flex gap-5 flex-col md:flex-row">
      {!hasBuyer && (
        <button
          onClick={onPurchase}
          className="bg-[#C4E703] min-h-[54px] border border-black text-black font-medium text-xl md:text-2xl py-1.5 px-4 md:py-2.5 md:px-10 rounded-full hover:bg-[#d1f033] transition-colors"
        >
          Buy
        </button>
      )}

      {hasDemoFile && (
        <button
          onClick={onDownloadDemo}
          className="border border-black min-h-[54px] text-black font-medium text-2xl py-2.5 px-10 rounded-full hover:bg-gray-100 transition-colors"
        >
          Download Demo
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
