import { Input } from '../../../components/ui/input';
import { Banner } from '../components/banner';
import { Categories } from '../components/categories';
import { useMarket } from '../hooks/useMarket';

import { ProjectCard } from '@/components/common/ProjectCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const MarketPage = () => {
  const { sales, isLoading, error } = useMarket();

  return (
    <div className="container mx-auto p-4 flex flex-col gap-[20px]">
      <Banner />
      <Categories />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Discover</h1>
        <div className="flex items-center gap-[10px]">
          <Input className="rounded-[30px]" placeholder="Search" />
          <Select defaultValue="newest">
            <SelectTrigger className="w-[260px] rounded-[30px]">
              <SelectValue placeholder="Newest" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px] rounded-[30px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px] mb-[100px]">
        {sales.map((s) => (
          <ProjectCard key={s.id} {...s} />
        ))}
      </div>
    </div>
  );
};

export default MarketPage;
