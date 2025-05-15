import { SquareCheckBig, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Badge } from '../ui/badge';
import { Button, buttonVariants } from '../ui/button';
import { Separator } from '../ui/separator';

import { cn } from '@/utils/cn';

interface ProjectCardProps {
  id: string;
  image: string;
  title: string;
  description: string;
  tags: string[];
  price: string;
  isAudited?: boolean;
}

export const ProjectCard = ({
  id,
  image,
  title,
  description,
  tags,
  price,
  isAudited,
}: ProjectCardProps) => {
  return (
    <div className="flex flex-col relative">
      <img
        src={image}
        alt={title}
        className="max-h-[200px] w-full object-cover h-full rounded-t-[40px]"
      />
      {isAudited && (
        <div className="absolute top-[20px] right-[20px] bg-white/60 flex items-center gap-[10px] px-[20px] py-[10px] rounded-[20px]">
          <SquareCheckBig className="text-[#2001EB]" />
          <span>Pass audit</span>
        </div>
      )}
      <div className="flex flex-col gap-[20px] px-[30px] py-[20px] border border-[#C7C7C7] rounded-b-[40px]">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-[28px]">Project name</div>
          <Button variant="ghost" size="icon">
            <Star />
          </Button>
        </div>
        <div className="text-[18px] truncate">{description}</div>
        <div className="flex items-center gap-[10px] flex-wrap">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="font-normal">
              {tag}
            </Badge>
          ))}
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="text-[#9E9E9E] text-[18px]">Price</div>
            <div className="text-[20px]">{price} USDC/SOL</div>
          </div>
          <Link
            to={`/projects/${id}`}
            className={cn(
              buttonVariants(),
              'py-[15px] px-[40px] text-[24px] font-medium bg-[#C4E703] border border-black rounded-[30px] text-black hover:bg-[#C4E703]',
            )}
          >
            Buy
          </Link>
        </div>
      </div>
    </div>
  );
};
