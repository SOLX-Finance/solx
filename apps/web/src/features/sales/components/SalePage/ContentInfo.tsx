import React from 'react';

interface ContentInfoProps {
  userWillGet: string;
}

const ContentInfo: React.FC<ContentInfoProps> = ({ userWillGet }) => {
  return (
    <div className="space-y-5">
      <h2 className="text-4xl font-semibold">What you will get</h2>
      <p className="text-lg">{userWillGet}</p>
    </div>
  );
};

export default ContentInfo;
