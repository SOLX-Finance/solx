import { useQueryClient } from '@tanstack/react-query';
import { Pen } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import FilterableSales from '../components/FilterableSales';
import KycVerification from '../components/KycVerification';
import { useProfile } from '../hooks/useProfile';
import { useUserSales, SalesFilter } from '../hooks/useUserSales';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { env } from '@/config/env';
import { FileType, useFileUploadQuery } from '@/hooks/useFileUploadQuery';
import { stats } from '@/mocks';

interface MyProfileStatProps {
  label: string;
  value: string;
}

const MyProfileStat = ({ label, value }: MyProfileStatProps) => {
  return (
    <div className="flex flex-col gap-[20px] w-[320px] p-[40px] h-[180px] border border-[#C7C7C7] rounded-[40px] justify-center">
      <div className="text-[20px]">{label}</div>
      <div className="text-[20px] font-medium">
        <span className="text-[40px]">{value}</span> USDC
      </div>
    </div>
  );
};

const MyProfilePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isLoading, error, refetchProfile, updateProfile } =
    useProfile();
  const [editingUsername, setEditingUsername] = useState(false);
  const [username, setUsername] = useState('');
  const [inputWidth, setInputWidth] = useState(300);
  const [activeTab, setActiveTab] = useState<SalesFilter>('created');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLDivElement>(null);

  const {
    sales,
    isLoading: salesLoading,
    total,
    currentPage,
    totalPages,
    limit,
    handleNextPage,
    handlePrevPage,
    goToPage,
    changeLimit,
    refetch: refetchSales,
  } = useUserSales(user?.walletAddress || '', activeTab);

  const { uploadFiles } = useFileUploadQuery();

  useEffect(() => {
    if (user?.walletAddress) {
      refetchSales();
    }
  }, [activeTab, user?.walletAddress, refetchSales]);

  const handleUsernameEdit = () => {
    if (editingUsername) {
      // If already editing, submit the changes
      handleUsernameSubmit();
    } else if (user) {
      // Start editing
      setUsername(user.username || '');
      setEditingUsername(true);

      // Get the width of the username element immediately before editing
      if (usernameRef.current) {
        const width = usernameRef.current.getBoundingClientRect().width;
        setInputWidth(Math.max(width, 200)); // Set a minimum width
      }
    }
  };

  const handleUsernameSubmit = async () => {
    setEditingUsername(false);

    if (!user) return;

    try {
      const previousUsername = user.username;

      queryClient.setQueryData(['profile'], {
        ...user,
        username: username,
      });

      updateProfile({
        username: username,
      }).catch((error) => {
        console.error('Failed to update username', error);

        queryClient.setQueryData(['profile'], {
          ...user,
          username: previousUsername,
        });
      });
    } catch (error) {
      console.error('Failed to update username', error);
    }
  };

  const handleUsernameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleUsernameSubmit();
    } else if (e.key === 'Escape') {
      setEditingUsername(false);
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const [uploadedFile] = await uploadFiles(
        [file],
        FileType.PROFILE_PICTURE,
      );

      await updateProfile({
        profilePictureId: uploadedFile.id,
      });

      refetchProfile();
    } catch (error) {
      console.error('Failed to upload profile picture', error);
    }
  };

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

  return (
    <div className="container mx-auto p-4 flex flex-col gap-[40px]">
      <div className="flex gap-[40px]">
        <div className="flex gap-[40px]">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          {user.profilePictureId ? (
            <img
              src={`${env.api.url}/storage/${user.profilePictureId}`}
              alt="Profile"
              width={180}
              height={180}
              crossOrigin="anonymous"
              className="my-auto rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleProfilePictureClick}
            />
          ) : (
            <div
              className="my-auto min-w-[180px] min-h-[180px] size-[180px] bg-gray-200 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-300 transition-colors"
              onClick={handleProfilePictureClick}
            >
              <span className="text-gray-500">No Image</span>
            </div>
          )}
          <div className="flex flex-col gap-[10px]">
            {editingUsername ? (
              <div
                style={{
                  width: `${inputWidth}px`,
                  height: '60px',
                  position: 'relative',
                }}
              >
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleUsernameKeyDown}
                  className="text-[50px] leading-[60px] font-semibold py-0 bg-transparent border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus:outline-none focus:ring-0 px-0 transition-all duration-300 w-full placeholder:text-[50px] h-[60px]"
                  style={{
                    fontSize: '50px',
                    lineHeight: '60px',
                    fontWeight: 600,
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                  autoFocus
                />
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#BA8FFF]"></div>
              </div>
            ) : (
              <div
                ref={usernameRef}
                className="text-[50px] leading-[60px] font-semibold inline-block h-[60px]"
                style={{ boxSizing: 'border-box', position: 'relative' }}
              >
                {user.username || 'Anonymous'}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-transparent"></div>
              </div>
            )}
            <div className="text-[18px]">
              Wallet: {user.walletAddress.substring(0, 6)}...
              {user.walletAddress.substring(user.walletAddress.length - 4)}
            </div>
            <div className="text-[18px]">KYC Status: {user.kycStatus}</div>
          </div>
          <button
            className="border self-start mt-1 border-[#C7C7C7] rounded-full size-[60px] min-w-[60px] min-h-[60px] flex justify-center items-center hover:bg-gray-100 transition-colors"
            onClick={handleUsernameEdit}
          >
            <Pen className="size-5" />
          </button>
        </div>
        <div className="bg-black flex-1 h-[180px] rounded-[40px] relative flex justify-center items-center">
          <Button
            onClick={() => navigate('/sales/create')}
            className="relative min-w-[254px] min-h-[60px] hover:bg-white bg-[#BA8FFF] rounded-[30px] text-black text-[24px] leading-[30px] font-medium duration-300"
          >
            Create Sale
          </Button>
        </div>
      </div>

      <div className="flex gap-5">
        {stats.map((s) => (
          <MyProfileStat key={s.label} {...s} />
        ))}
      </div>

      <div className="flex items-center gap-[20px]">
        <Button
          className={`relative min-h-[60px] min-w-[355px] ${activeTab === 'bought' ? 'bg-[#BA8FFF]' : 'bg-white'} hover:bg-[#BA8FFF] rounded-[30px] text-black px-[40px] py-[15px] text-[24px] font-medium border border-black leading-[30px] duration-300`}
          onClick={() => setActiveTab('bought')}
        >
          Bought Sales
        </Button>
        <Button
          className={`relative min-h-[60px] min-w-[355px] ${activeTab === 'created' ? 'bg-[#BA8FFF]' : 'bg-white'} hover:bg-[#BA8FFF] rounded-[30px] text-black px-[40px] py-[15px] text-[24px] font-medium border border-black leading-[30px] duration-300`}
          onClick={() => setActiveTab('created')}
        >
          My Sales
        </Button>
      </div>

      {salesLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <FilterableSales
          walletAddress={user?.walletAddress || ''}
          activeTab={activeTab}
          sales={sales || []}
          currentPage={currentPage}
          totalPages={totalPages}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          onPageChange={goToPage}
          onLimitChange={changeLimit}
          total={total}
          limit={limit}
        />
      )}

      {/* KYC Verification Section (hidden by default, can be toggled with a button) */}
      <div className="mb-6">
        <details className="bg-white shadow-sm rounded-[40px] p-4">
          <summary className="text-[24px] font-semibold cursor-pointer">
            KYC Verification
          </summary>
          <div className="mt-4">
            <KycVerification
              kycStatus={user.kycStatus}
              onKycUpdated={refetchProfile}
            />
          </div>
        </details>
      </div>
    </div>
  );
};

export default MyProfilePage;
