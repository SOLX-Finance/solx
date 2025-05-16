import React from 'react';

interface ContentInfoProps {
  hasContentFile: boolean;
}

const ContentInfo: React.FC<ContentInfoProps> = ({ hasContentFile }) => {
  return (
    <div className="space-y-5">
      <h2 className="text-4xl font-semibold">What you will get</h2>
      <p className="text-lg">
        {hasContentFile
          ? "After purchase, you'll get immediate access to all project files and content."
          : "Information about what's included will be available after purchase."}
      </p>
    </div>
  );
};

export default ContentInfo;
