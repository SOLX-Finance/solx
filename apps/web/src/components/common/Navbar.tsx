import { usePrivy } from '@privy-io/react-auth';
import { Star, Mail, ChevronDown } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import LoginButton from './LoginButton';

import logo from '../../assets/logo/logo.svg';
import { env } from '../../config/env';
import { useProfile } from '../../features/profile/hooks/useProfile';
import { cn } from '../../utils/cn';
import { Button } from '../ui/button';

interface CircleButtonProps {
  icon: ReactNode;
  onClick: () => void;
}
const CircleButton = ({ icon, onClick }: CircleButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="rounded-full bg-transparent hover:bg-white/10 border border-white/20 text-white hover:text-white"
    >
      {icon}
    </Button>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const { ready, authenticated, logout, user: privyUser } = usePrivy();
  const { user } = useProfile();
  const [showDropdown, setShowDropdown] = useState(false);

  const walletAddress = user?.walletAddress || privyUser?.wallet?.address || '';
  const shortenedAddress = walletAddress
    ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
    : '';

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="bg-black flex w-full justify-between max-w-[calc(100%-40px)] md:max-w-[calc(100%-64px)] mx-auto px-[25px] py-[29px] mt-[20px] md:mt-[30px] text-white rounded-[40px]">
      <button
        onClick={() => navigate('/market')}
        className="flex items-end gap-[20px]"
      >
        <img src={logo} alt="logo" />
        <h1 className="font-brand text-[30px] leading-[30px]">SOLX</h1>
      </button>
      <div className="gap-[40px] flex items-center">
        <div>About Project</div>
        <div className="gap-[20px] flex items-center">
          <CircleButton
            icon={<Star />}
            onClick={() => {
              // No-op
            }}
          />
          <CircleButton
            icon={<Mail />}
            onClick={() => {
              // No-op
            }}
          />
        </div>
        <div className="relative">
          {ready && authenticated ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-2">
                  {user?.profilePictureId ? (
                    <button onClick={() => navigate('/profile')}>
                      <img
                        src={`${env.api.url}/storage/${user.profilePictureId}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                      />
                    </button>
                  ) : (
                    <div className="w-full h-full bg-lime-300 flex items-center justify-center text-black font-medium">
                      {(user?.username || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center bg-lime-300 text-black font-medium py-2 px-4 rounded-full"
                >
                  <span>{shortenedAddress}</span>
                  <ChevronDown
                    className={cn(
                      'ml-1 h-4 w-4 transition-transform duration-300',
                      showDropdown && 'rotate-180',
                    )}
                  />
                </button>
              </div>

              {showDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-lime-300 rounded-3xl py-3 px-6 z-10">
                  <button
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                    }}
                    className="text-black font-medium whitespace-nowrap"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
