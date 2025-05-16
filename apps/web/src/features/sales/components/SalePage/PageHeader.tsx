import { ArrowLeft } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  onGoBack: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onGoBack }) => {
  return (
    <div className="flex mb-5 justify-between items-center">
      <Button
        variant="outline"
        className="w-fit rounded-[25px] h-[50px]"
        onClick={onGoBack}
      >
        <ArrowLeft className="mr-2 w-4 h-4" /> Go back
      </Button>

      <div className="flex justify-end gap-4 lg:hidden">
        <button className="size-[50px] min-w-[50px] min-h-[50px] border border-gray-300 rounded-full flex items-center justify-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
        <button className="size-[50px] min-w-[50px] min-h-[50px] border border-gray-300 rounded-full flex items-center justify-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PageHeader;
