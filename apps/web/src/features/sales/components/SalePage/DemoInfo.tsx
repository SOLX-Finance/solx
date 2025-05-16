import React from 'react';

interface DemoInfoProps {
  hasDemoFile: boolean;
  onDownloadDemo: () => void;
  isLoading?: boolean;
}

const DemoInfo: React.FC<DemoInfoProps> = ({
  hasDemoFile,
  onDownloadDemo,
  isLoading = false,
}) => {
  if (!hasDemoFile) return null;

  return (
    <div className="space-y-5">
      <h2 className="text-4xl font-semibold">What in demo</h2>
      <p className="text-lg">
        A demo version of this project is available. Download it to preview the
        content before purchasing.
      </p>
      <button
        onClick={onDownloadDemo}
        disabled={isLoading}
        className={`border border-black text-black font-medium text-2xl py-2.5 px-10 rounded-full transition-colors ${
          isLoading ? 'bg-gray-200 cursor-not-allowed' : 'hover:bg-gray-100'
        }`}
      >
        {isLoading ? 'Loading...' : 'Download Demo'}
      </button>
    </div>
  );
};

export default DemoInfo;
