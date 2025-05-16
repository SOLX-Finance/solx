import { Pen } from 'lucide-react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { env } from '@/config/env';
import { User } from '@/features/profile/api/profileApi';

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  onUsernameEdit?: (username: string) => Promise<void>;
  onProfilePictureChange?: (file: File) => Promise<void>;
}

export const ProfileHeader = ({
  user,
  isOwnProfile,
  onUsernameEdit,
  onProfilePictureChange,
}: ProfileHeaderProps) => {
  const navigate = useNavigate();
  const [editingUsername, setEditingUsername] = useState(false);
  const [username, setUsername] = useState('');
  const [inputWidth, setInputWidth] = useState(300);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLDivElement>(null);

  const handleUsernameEdit = () => {
    if (!isOwnProfile || !onUsernameEdit) return;

    if (editingUsername) {
      // If already editing, submit the changes
      handleUsernameSubmit();
    } else {
      // Start editing
      setUsername(user.username || '');
      setEditingUsername(true);

      // Get the width of the username element immediately before editing
      if (usernameRef.current) {
        const width = usernameRef.current.getBoundingClientRect().width;
        setInputWidth(Math.max(width, 200));
      }
    }
  };

  const handleUsernameSubmit = async () => {
    setEditingUsername(false);
    if (onUsernameEdit) {
      await onUsernameEdit(username);
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
    if (isOwnProfile && onProfilePictureChange) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onProfilePictureChange) {
      await onProfilePictureChange(file);
    }
  };

  return (
    <div className="flex gap-[40px] max-lg:flex-col">
      <div className="flex lg:gap-[40px] gap-2.5">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={!isOwnProfile || !onProfilePictureChange}
        />
        {user.profilePictureId ? (
          <button
            className="lg:my-auto rounded-full min-w-[50px] min-h-[50px] lg:min-w-[180px] lg:min-h-[180px] lg:size-[180px] size-[50px] object-cover"
            onClick={handleProfilePictureClick}
          >
            <img
              src={`${env.api.url}/storage/${user.profilePictureId}`}
              alt="Profile"
              crossOrigin="anonymous"
              className={` rounded-full lg:size-[180px] size-[50px] object-cover ${
                isOwnProfile && onProfilePictureChange
                  ? 'cursor-pointer hover:opacity-80 transition-opacity'
                  : ''
              }`}
            />
          </button>
        ) : (
          <div
            className={`lg:my-auto lg:min-w-[180px] lg:min-h-[180px] lg:size-[180px] min-w-[50px] min-h-[50px] size-[50px] bg-gray-200 flex items-center justify-center rounded-full ${
              isOwnProfile && onProfilePictureChange
                ? 'cursor-pointer hover:bg-gray-300 transition-colors'
                : ''
            }`}
            onClick={handleProfilePictureClick}
          >
            <span className="text-gray-500 max-lg:hidden">No Image</span>
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
                className="lg:text-[50px] text-[28px] lg:leading-[60px] font-semibold py-0 bg-transparent border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus:outline-none focus:ring-0 px-0 transition-all duration-300 w-full placeholder:text-[50px] h-[60px]"
                style={{
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
              className="lg:text-[50px] text-[28px] lg:leading-[60px] font-semibold inline-block lg:h-[60px]"
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
        {isOwnProfile && onUsernameEdit && (
          <button
            className="border self-start mt-1 border-[#C7C7C7] rounded-full size-[30px] lg:size-[60px] min-w-[30px] lg:min-w-[60px] min-h-[30px] lg:min-h-[60px] flex justify-center items-center hover:bg-gray-100 transition-colors"
            onClick={handleUsernameEdit}
          >
            <Pen className="lg:size-5 size-3" />
          </button>
        )}
      </div>
      {isOwnProfile && (
        <div
          style={{ backgroundImage: "url('/create-sale-bg.webp')" }}
          className="bg-black flex-1 max-lg:!bg-none max-lg:bg-transparent h-[180px] rounded-[40px] relative flex justify-center items-center bg-cover bg-center"
        >
          <Button
            onClick={() => navigate('/sales/create')}
            className="relative min-w-[254px] max-lg:min-w-full min-h-[60px] hover:bg-white bg-[#BA8FFF] rounded-[30px] text-black text-[24px] leading-[30px] font-medium duration-300"
          >
            Create Sale
          </Button>
        </div>
      )}
    </div>
  );
};
