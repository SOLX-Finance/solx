import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

interface ProfileStatItemProps {
  label: string;
  value: string;
}

const ProfileStatItem = ({ label, value }: ProfileStatItemProps) => {
  return (
    <div className="flex flex-col gap-[20px] w-full md:w-[320px] p-[40px] h-[180px] border border-[#C7C7C7] rounded-[40px] justify-center">
      <div className="text-[20px]">{label}</div>
      <div className="text-[20px] font-medium">
        <span className="text-[40px]">{value}</span> SOL
      </div>
    </div>
  );
};

interface ProfileStatsProps {
  stats: Array<{ label: string; value: string }>;
}

export const ProfileStats = ({ stats }: ProfileStatsProps) => {
  return (
    <>
      <div className="flex flex-col gap-5">
        <Carousel className="md:hidden ">
          <CarouselContent>
            {stats.map((stat) => (
              <CarouselItem className="basis-[66%]" key={stat.label}>
                <ProfileStatItem key={stat.label} {...stat} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      <div className="flex gap-5 max-md:hidden">
        {stats.map((stat) => (
          <ProfileStatItem key={stat.label} {...stat} />
        ))}
      </div>
    </>
  );
};
