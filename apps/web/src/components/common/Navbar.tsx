import { usePrivy } from '@privy-io/react-auth';
import { Star, Mail } from 'lucide-react';
import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  return (
    <div className="container mx-auto mt-[30px] text-white">
      <nav className="bg-black flex items-center justify-between px-[30px] py-[20px] rounded-[40px]">
        <div className="flex items-end gap-[20px]">
          <img src={logo} alt="logo" />
          <h1 className="font-brand text-[30px] leading-[30px]">SOLX</h1>
        </div>
        <div className="gap-[40px] flex items-center">
          <div>About Project</div>
          <div className="gap-[20px] flex items-center">
            <CircleButton icon={<Star />} onClick={() => {}} />
            <CircleButton icon={<Mail />} onClick={() => {}} />
          </div>
          <Button
            className="bg-[#C4E703] text-black rounded-[25px] px-[50px] py-[12px] text-[18px] font-medium hover:bg-[#C4E703]"
            onClick={() => {
              // todo
              navigate('/profile');
            }}
          >
            Sign In
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
