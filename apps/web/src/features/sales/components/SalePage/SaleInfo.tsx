import React from 'react';
import { formatUnits } from 'viem';

import { CategoryTags } from '.';
interface SaleInfoProps {
  title: string;
  description: string;
  categories: string[];
  priceUsd: bigint;
  whatYouWillGet: string;
}

const SaleInfo: React.FC<SaleInfoProps> = ({
  title,
  description,
  categories,
  priceUsd,
  whatYouWillGet,
}) => {
  return (
    <div className="space-y-10">
      <div className="space-y-5">
        <div>
          <h1 className="text-5xl font-semibold">{title}</h1>
          <CategoryTags categories={categories} />
        </div>

        <p className="text-lg whitespace-pre-line">{description}</p>
      </div>

      {/* Price section */}
      <div>
        <p className="text-xl">Price</p>
        <p className="text-4xl font-medium">
          {`$${formatUnits(priceUsd, 9)} SOL`}
        </p>
      </div>
    </div>
  );
};

export default SaleInfo;
