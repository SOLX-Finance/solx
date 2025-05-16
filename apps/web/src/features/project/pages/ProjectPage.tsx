import { ArrowLeft, ArrowRight, SquareCheckBig, Star } from 'lucide-react';
import React, { useMemo } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

import mine from '../../../assets/logo/mine.svg';
import telegram from '../../../assets/logo/telegram-black.svg';

import { ProjectCard } from '@/components/common/ProjectCard';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  TooltipContent,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { projects } from '@/mocks';
import { cn } from '@/utils/cn';

const ProjectPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const project = useMemo(
    () => projects.find((p) => p.id === projectId),
    [projectId],
  );

  if (!project) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container mx-auto p-4 flex flex-col gap-[20px]">
      <Button
        variant="outline"
        className="w-fit rounded-[25px]"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 w-4 h-4" /> Go back
      </Button>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-[40px]">
        <Carousel>
          <CarouselContent>
            <CarouselItem>
              <div className="relative">
                <img
                  src={project.image}
                  alt={project.id}
                  className="w-full rounded-[40px]"
                />
                {project.isAudited && (
                  <div className="absolute top-[20px] right-[20px] bg-white/60 flex items-center gap-[10px] px-[20px] py-[10px] rounded-[20px]">
                    <SquareCheckBig className="text-[#2001EB]" />
                    <span>Pass audit</span>
                  </div>
                )}
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className="flex gap-[10px]">
          <div className="flex flex-col gap-[20px]">
            <div className="text-[50px] font-semibold">{project.title}</div>
            <div className="flex items-center flex-wrap gap-[10px]">
              {project.tags.map((t) => (
                <Badge
                  variant="outline"
                  key={t}
                  className="text-[18px] font-normal px-[20px] py-[10px]"
                >
                  {t}
                </Badge>
              ))}
            </div>
            <div className="text-[18px]">{project.description}</div>
            <div className="my-[20px] flex flex-col">
              <div className="text-[20px]">Price</div>
              <div className="text-[36px] font-medium">{project.price} SOL</div>
            </div>
            <div className="flex items-center gap-[20px]">
              <Button className="leading-[30px] text-[24px] font-medium py-[15px] px-[40px] rounded-[30px] bg-[#C4E703] hover:bg-[#C4E703] text-black border border-black">
                Buy
              </Button>
              <Button className="leading-[30px] text-[24px] font-medium py-[15px] px-[40px] rounded-[30px] bg-white hover:bg-white text-black border border-black">
                Download Demo
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center gap-[20px]">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full"
                  >
                    <Star />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to favorites</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full"
                  >
                    <img src={telegram} alt="report" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Report</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-[60px]">
        <div className="lg:col-span-2 flex flex-col gap-[40px]">
          <div>
            <div className="text-[36px] font-semibold">About project</div>
            <div className="text-[18px]">{project.about}</div>
          </div>
          <div>
            <div className="text-[36px] font-semibold">What you will get</div>
            <div className="text-[18px]">{project.whatYouGet}</div>
          </div>
          <div>
            <div className="text-[36px] font-semibold">What in demo</div>
            <div className="text-[18px]">{project.whatInDemo}</div>
          </div>
          <Button className="leading-[30px] text-[24px] font-medium py-[15px] px-[40px] rounded-[30px] bg-white hover:bg-white text-black border border-black w-fit">
            Download Demo
          </Button>
        </div>
        <div className="flex flex-col gap-[80px] items-end">
          <div className="flex flex-col p-[30px] rounded-[30px] gap-[30px] border border-[#D9D9D9]">
            <div className="flex flex-col gap-[20px]">
              <div className="flex items-center gap-[20px]">
                <img
                  src={project.owner.image}
                  alt={project.owner.name}
                  width={60}
                  height={60}
                />
                <div>
                  <div className="text-[24px] font-medium">
                    {project.owner.name}
                  </div>
                  <div className="text-[#9E9E9E] text-[18px]">Owner by</div>
                </div>
              </div>
              <div className="text-[14px]">{project.owner.description}</div>
            </div>
            <Link
              to={`/profile/${project.owner.id}`}
              className={cn(
                buttonVariants(),
                'hover:bg-[#BA8FFF] bg-[#BA8FFF] text-black text-[24px] font-medium py-[15px] rounded-[30px] border border-black',
              )}
            >
              Other Projects <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
          <img src={mine} alt="mine" className="w-[100px]" />
        </div>
      </div>
      <div className="text-[36px] font-semibold mt-[60px]">
        You may be interested
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px] mb-[100px]">
        {projects.map((p) => (
          <ProjectCard key={p.id} {...p} />
        ))}
      </div>
    </div>
  );
};

export default ProjectPage;
