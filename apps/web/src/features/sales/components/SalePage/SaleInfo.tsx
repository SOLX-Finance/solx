import React from 'react';
import { formatUnits } from 'viem';

import { CategoryTags } from '.';
interface SaleInfoProps {
  title: string;
  description: string;
  categories: string[];
  priceUsd: bigint;
}

const SaleInfo: React.FC<SaleInfoProps> = ({
  title,
  description,
  categories,
  priceUsd,
}) => {
  return (
    <div className="space-y-10">
      <div className="space-y-5">
        <div className="flex justify-between">
          <div>
            <h1 className="text-5xl font-semibold">{title}</h1>
            <CategoryTags categories={categories} />
          </div>
          <div className="flex justify-end gap-4 max-lg:hidden">
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
