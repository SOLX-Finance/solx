import { ImageIcon, SquareCheckBig } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatUnits } from 'viem';

import { Badge } from '../ui/badge';
import { buttonVariants } from '../ui/button';
import { Separator } from '../ui/separator';
import { Spinner } from '../ui/spinner';

import { cn } from '@/utils/cn';

interface ProjectCardProps {
  id: string;
  image: string;
  title: string;
  description: string;
  tags: string[];
  price: bigint;
  bought?: boolean;
  isAudited?: boolean;
  showDownload?: boolean;
  onDownload?: () => void;
  isDownloading?: boolean;
}

export const ProjectCard = ({
  id,
  image,
  title,
  description,
  tags,
  price,
  bought = false,
  isAudited = false,
  showDownload = false,
  onDownload,
  isDownloading = false,
}: ProjectCardProps) => {
  const normalizedTitle = title || 'Untitled';
  const normalizedDescription = description || 'No description';
  const normalizedTags = Array.isArray(tags) ? tags : [];
  const [imageError, setImageError] = useState(false);
  const hasValidImage = Boolean(
    image &&
      image.trim() !== '' &&
      !image.includes('placeholder.jpg') &&
      !imageError,
  );

  const renderCardHeader = () => {
    if (hasValidImage) {
      return (
        <img
          src={image}
          alt={normalizedTitle}
          className="max-h-[200px] w-full object-cover h-full rounded-t-[40px]"
          crossOrigin="anonymous"
          onError={() => setImageError(true)}
        />
      );
    }

    return (
      <div className="max-h-[200px] w-full h-[200px] rounded-t-[40px] bg-gray-200 flex items-center justify-center">
        <ImageIcon className="h-12 w-12 text-gray-400" />
      </div>
    );
  };

  return (
    <div className="flex flex-col relative border border-[#C7C7C7] rounded-[40px]">
      <Link to={`/sales/${id}`}>{renderCardHeader()}</Link>

      {isAudited && (
        <div className="absolute top-[20px] right-[20px] bg-white/60 flex items-center gap-[10px] px-[20px] py-[10px] rounded-[20px]">
          <SquareCheckBig className="text-[#2001EB]" />
          <span>Pass audit</span>
        </div>
      )}

      <div className="flex flex-col gap-[20px] px-[30px] py-[20px] border-t border-[#C7C7C7]">
        <div className="flex items-center">
          <div className="font-semibold text-[28px]">{normalizedTitle}</div>
        </div>
        <div className="text-[18px] truncate">{normalizedDescription}</div>
        <div className="flex items-center gap-[10px] flex-wrap">
          {normalizedTags.map((tag) => (
            <Badge key={tag} variant="outline" className="font-normal">
              {tag}
            </Badge>
          ))}
        </div>
        <Separator />
        <div className="flex items-center max-md:flex-col justify-between">
          <div className="flex flex-col max-md:w-full">
            <div className="text-[#9E9E9E] text-[18px]">Price</div>
            <div className="text-[20px]">{formatUnits(price, 9)} SOL</div>
          </div>

          {!bought && (
            <Link
              to={`/sales/${id}`}
              className={cn(
                buttonVariants(),
                'py-[15px] px-[40px] max-md:w-full text-[24px] font-medium bg-[#C4E703] border border-black rounded-[30px] text-black hover:bg-[#C4E703]',
              )}
            >
              Buy
            </Link>
          )}

          {bought && showDownload && (
            <button
              onClick={onDownload}
              disabled={isDownloading}
              className={cn(
                'h-[54px] px-[40px] max-md:w-full text-[24px] font-medium bg-[#C4E703] border border-black rounded-[30px] text-black hover:bg-[#d1f033] transition-colors',
                isDownloading && 'bg-opacity-70 cursor-not-allowed',
              )}
            >
              {isDownloading ? (
                <span className="flex items-center">
                  <Spinner size="small" className="mr-2" /> Generating...
                </span>
              ) : (
                'Download'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
