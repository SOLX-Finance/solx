import { ArrowLeft } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  onGoBack: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onGoBack }) => {
  return (
    <div className="flex mb-5 items-center">
      <Button
        variant="outline"
        className="w-fit rounded-[25px] h-[50px]"
        onClick={onGoBack}
      >
        <ArrowLeft className="mr-2 w-4 h-4" /> Go back
      </Button>
    </div>
  );
};

export default PageHeader;
