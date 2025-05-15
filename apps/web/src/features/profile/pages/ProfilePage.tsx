import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { ProjectCard } from '@/components/common/ProjectCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { owners, projects } from '@/mocks';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();

  const user = useMemo(() => owners.find((o) => o.id === userId), [userId]);

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
      <div className="flex justify-between">
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
        <div>On SOLX since: {user.since.toLocaleDateString()}</div>
      </div>
      <div className="grid grid-cols-3 gap-[40px]">
        <div className="col-span-2">
          <div className="flex flex-col gap-[20px]">
            <div className="text-[36px] font-semibold">About Author</div>
            <div>{user.description}</div>
            <div className="flex items-center gap-[10px]">
              {user.tags.map((t) => (
                <Badge
                  key={t}
                  variant="outline"
                  className="px-[20px] py-[10px] text-[18px] font-normal"
                >
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-[40px] border border-[#D9D9D9] p-[30px] flex flex-col gap-[20px]">
          <div>Send message to {user.name}</div>
          <Input placeholder="Text" />
          <Button className="hover:bg-[#BA8FFF] bg-[#BA8FFF] text-black text-[24px] font-medium py-[15px] rounded-[30px] border border-black">
            Send <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="text-[36px] font-semibold">{user.name} Projects</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px] mb-[100px]">
        {userProjects.map((p) => (
          <ProjectCard key={p.id} {...p} />
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
