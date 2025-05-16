import React from 'react';

import { env } from '@/config/env';

interface PreviewSectionProps {
  previewFile?: {
    id: string;
  };
  title: string;
  isAudited?: boolean;
}

const PreviewSection: React.FC<PreviewSectionProps> = ({
  previewFile,
  title,
  isAudited,
}) => {
  return (
    <div className="flex-1">
      <div className="bg-gray-100 rounded-[40px] h-[480px] mb-10 relative">
        {previewFile ? (
          <img
            src={`${env.api.url}/storage/${previewFile.id}`}
            alt={title}
            className="w-full h-full object-cover rounded-[40px]"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-[40px]">
            <span className="text-gray-500">No preview available</span>
          </div>
        )}

        {/* "Pass audit" badge - render if sale is audited */}
        {isAudited && (
          <div className="absolute top-5 right-5 bg-white/60 backdrop-blur-lg rounded-[20px] flex items-center gap-2 px-5 py-2">
            <div className="text-blue-600">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <span className="text-black font-normal">Pass audit</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewSection;
