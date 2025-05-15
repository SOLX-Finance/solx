import { ArrowLeft } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

import create from '../../../assets/profile/create.png';

import { ProjectCard } from '@/components/common/ProjectCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { owners, projects } from '@/mocks';

const userId = '1';

interface MyProfileStatProps {
  label: string;
  value: string;
}
const MyProfileStat = ({ label, value }: MyProfileStatProps) => {
  return (
    <div className="flex flex-col gap-[20px] p-[40px] border border-[#C7C7C7] rounded-[40px]">
      <div className="text-[20px]">{label}</div>
      <div className="text-[20px] font-medium">
        <span className="text-[40px]">{value}</span> USDC
      </div>
    </div>
  );
};

const stats = [
  {
    label: 'Current Balance',
    value: '$10k',
  },
  {
    label: 'Pending Balance',
    value: '$10k',
  },
  {
    label: 'Earn Balance',
    value: '$10k',
  },
  {
    label: 'Spent Balance',
    value: '$10k',
  },
  {
    label: 'Collateral Amount',
    value: '$10k',
  },
];

const MyProfilePage = () => {
  const navigate = useNavigate();

  const user = useMemo(() => owners.find((o) => o.id === userId), []);

  const userProjects = useMemo(
    () => projects.filter((p) => p.owner.id === user?.id),
    [user],
  );

  if (!user) {
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
      <div className="grid grid-cols-2">
        <div className="flex gap-[40px]">
          <img src={user.image} alt={user.name} width={180} height={180} />
          <div className="flex flex-col gap-[10px]">
            <div className="text-[50px] leading-[60px] font-semibold">
              {user.name}
            </div>
            <div className="text-[18px]">{user.position}</div>
            <div className="text-[18px]">
              Posted projects: {userProjects.length}
            </div>
          </div>
        </div>
        <div className="bg-black h-[180px] rounded-[40px] relative flex justify-center items-center">
          <img src={create} alt="bg" className="absolute bottom-50" />
          <Button className="relative hover:bg-[#BA8FFF] bg-[#BA8FFF] rounded-[30px] text-black px-[40px] py-[15px] text-[24px] font-medium">
            Create Project
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-[20px]">
        {stats.map((s) => (
          <MyProfileStat key={s.label} {...s} />
        ))}
      </div>
      <div className="flex items-center gap-[20px]">
        <Button className="relative hover:bg-[#BA8FFF] bg-[#BA8FFF] rounded-[30px] text-black px-[40px] py-[15px] text-[24px] font-medium border border-black leading-[30px]">
          Bought Project
        </Button>
        <Button className="relative hover:bg-white bg-white rounded-[30px] text-black px-[40px] py-[15px] text-[24px] font-medium border border-black leading-[30px]">
          Uploaded Project
        </Button>
      </div>
      <div className="flex items-center gap-[10px]">
        <Input className="rounded-[30px] w-[600px]" placeholder="Search" />
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px] mb-[100px]">
        {userProjects.map((p) => (
          <ProjectCard key={p.id} {...p} />
        ))}
      </div>
    </div>
  );
};

export default MyProfilePage;
