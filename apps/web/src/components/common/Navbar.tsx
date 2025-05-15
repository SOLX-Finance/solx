import { usePrivy } from '@privy-io/react-auth';
import { Star, Mail } from 'lucide-react';
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

import LoginButton from './LoginButton';

import logo from '../../assets/logo/logo.svg';
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
  const { ready, authenticated, logout } = usePrivy();
  const location = useLocation();

  return (
    <div className="container mx-auto mt-[30px] text-white">
      <nav className="bg-white shadow-sm">
        <div className="flex items-end gap-[20px]">
          <img src={logo} alt="logo" />
          <h1 className="font-brand text-[30px] leading-[30px]">SOLX</h1>
        </div>
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
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {ready && authenticated ? (
              <>
                <Link
                  to="/profile"
                  className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md ${
                    location.pathname.startsWith('/profile')
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 bg-white hover:text-gray-700'
                  }`}
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <LoginButton />
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
