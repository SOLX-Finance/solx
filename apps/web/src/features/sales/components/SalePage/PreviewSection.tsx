import React, { useState } from 'react';

import { env } from '@/config/env';

interface PreviewSectionProps {
  previewFiles: Array<{
    id: string;
  }>;
  title: string;
  isAudited?: boolean;
}

const PreviewSection: React.FC<PreviewSectionProps> = ({
  previewFiles,
  title,
  isAudited,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasMultipleImages = previewFiles.length > 1;

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? previewFiles.length - 1 : prevIndex - 1,
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === previewFiles.length - 1 ? 0 : prevIndex + 1,
    );
  };

  return (
    <div className="flex-1">
      <div className="bg-gray-100 rounded-[40px] h-[480px] mb-4 relative overflow-hidden">
        {previewFiles.length > 0 ? (
          <>
            <img
              src={`${env.api.url}/storage/${previewFiles[currentIndex].id}`}
              alt={`${title} - preview ${currentIndex + 1}`}
              className="w-full h-full object-cover rounded-[40px]"
              crossOrigin="anonymous"
            />

            {/* Navigation arrows - only show if multiple images */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm rounded-full p-2 hover:bg-white/90 transition-all"
                  aria-label="Previous image"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>

                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm rounded-full p-2 hover:bg-white/90 transition-all"
                  aria-label="Next image"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-[40px]">
            <span className="text-gray-500">No preview available</span>
          </div>
        )}

        {/* "Pass audit" badge - render if sale is audited */}
        {isAudited && (
          <div className="absolute top-5 right-5 bg-white/60 backdrop-blur-lg rounded-[20px] flex items-center gap-2 px-5 py-2 z-10">
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

      {/* Pagination indicators */}
      {hasMultipleImages && (
        <div className="flex justify-center gap-2 mb-6">
          {previewFiles.map((_, index) => (
            <button
              key={`indicator-${index}`}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentIndex ? 'bg-blue-600 scale-110' : 'bg-gray-300'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PreviewSection;
