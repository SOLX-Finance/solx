import React from 'react';

import { Spinner } from '@/components/ui/spinner';

interface ContentDownloadProps {
  isBuyer: boolean;
  hasContentFile: boolean;
  onDownloadContent: () => void;
  isLoading?: boolean;
}

const ContentDownload: React.FC<ContentDownloadProps> = ({
  isBuyer,
  hasContentFile,
  onDownloadContent,
  isLoading = false,
}) => {
  if (!isBuyer || !hasContentFile) return null;

  return (
    <div className="space-y-5 border p-6 rounded-2xl bg-blue-50">
      <h2 className="text-4xl font-semibold">Your Purchased Content</h2>
      <p className="text-lg">
        Thank you for your purchase! You can now download the full content of
        this project.
      </p>
      <button
        onClick={onDownloadContent}
        disabled={isLoading}
        className={`bg-[#3B82F6] border border-black text-white font-medium text-2xl py-2.5 px-10 rounded-full transition-colors flex items-center justify-center relative ${
          isLoading ? 'bg-blue-400 cursor-not-allowed' : 'hover:bg-[#2563EB]'
        }`}
      >
        {isLoading ? (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Spinner size="small" />
          </span>
        ) : (
          'Download Content'
        )}
      </button>
    </div>
  );
};

export default ContentDownload;
