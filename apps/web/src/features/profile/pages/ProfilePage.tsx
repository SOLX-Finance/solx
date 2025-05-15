import { ArrowLeft } from 'lucide-react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import KycVerification from '../components/KycVerification';
import ProfileForm from '../components/ProfileForm';
import UserSales from '../components/UserSales';
import { useProfile } from '../hooks/useProfile';

import { ProjectCard } from '@/components/common/ProjectCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { env } from '@/config/env';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { user, isLoading, error, refetchProfile } = useProfile();

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          User not found
        </div>
      </div>
    );
  }

  // Viewing other user's profile
  if (userId) {
    // Get the user's sales to display sales count
    const userSales = []; // This would come from a hook or API call

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
            {user.profilePictureId ? (
              <img
                src={`${env.api.url}/storage/${user.profilePictureId}`}
                alt="user-image"
                width={180}
                height={180}
                crossOrigin="anonymous"
                className="rounded-[20px] object-cover"
              />
            ) : (
              <div className="w-[180px] h-[180px] bg-gray-200 flex items-center justify-center rounded-[20px]">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
            <div className="flex flex-col gap-[10px]">
              <div className="text-[50px] leading-[60px] font-semibold">
                {user.username || 'Anonymous User'}
              </div>
              <div className="text-[18px]">
                Wallet: {user.walletAddress.substring(0, 6)}...
                {user.walletAddress.substring(user.walletAddress.length - 4)}
              </div>
              <div className="text-[18px]">Sales: {userSales.length}</div>
            </div>
          </div>
          <div>
            On SOLX since: {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-[40px]">
          <div className="col-span-2">
            <div className="flex flex-col gap-[20px]">
              <div className="text-[36px] font-semibold">About User</div>
              <div>User information not available</div>
              <div className="flex items-center gap-[10px]">
                <Badge
                  variant="outline"
                  className="px-[20px] py-[10px] text-[18px] font-normal"
                >
                  Solana
                </Badge>
                <Badge
                  variant="outline"
                  className="px-[20px] py-[10px] text-[18px] font-normal"
                >
                  Developer
                </Badge>
              </div>
            </div>
          </div>
          <div className="rounded-[40px] border border-[#D9D9D9] p-[30px] flex flex-col gap-[20px]">
            <div className="text-[18px]">
              Send message to {user.username || 'this user'}
            </div>
            <Input placeholder="Text" className="rounded-[20px]" />
            <Button className="hover:bg-[#BA8FFF] bg-[#BA8FFF] text-black text-[24px] font-medium py-[15px] rounded-[30px] border border-black">
              Send
            </Button>
          </div>
        </div>

        <div className="text-[36px] font-semibold">User Sales</div>

        <div className="flex items-center gap-[10px] mb-4">
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

        <div className="mb-[100px]">
          <UserSales walletAddress={user.walletAddress} />
        </div>
      </div>
    );
  }

  // Viewing own profile - redirecting to MyProfilePage
  // This redirection ensures separation of concerns between pages
  return <Navigate to="/my-profile" />;
};

export default ProfilePage;
