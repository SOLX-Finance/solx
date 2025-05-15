import { Figma, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

import footerLogo from '../../assets/logo/footer.svg';
import logo from '../../assets/logo/logo.svg';
import telegram from '../../assets/logo/telegram.svg';

export const Footer = () => {
  return (
    <footer className="bg-black flex w-full justify-between text-white">
      <div className="flex flex-col justify-between pt-[55px] pl-[100px] pb-[75px]">
        <div className="flex flex-col gap-[80px]">
          <div className="flex items-end gap-[20px]">
            <img src={logo} alt="logo" />
            <div className="font-brand text-[30px] leading-[30px]">SOLX</div>
          </div>
          <div className="flex items-center gap-[40px]">
            <div className="flex items-center gap-[20px]">
              <div className="min-w-[50px] min-h-[50px] rounded-full border border-white flex items-center justify-center">
                <Figma />
              </div>
              <Link
                to="#"
                target="_blank"
                className="text-white active:text-white hover:text-white hover:underline"
              >
                Figma Project File
              </Link>
            </div>
            <div className="flex items-center gap-[20px]">
              <div className="min-w-[50px] min-h-[50px] rounded-full border border-white flex items-center justify-center">
                <Github />
              </div>
              <Link
                to="#"
                target="_blank"
                className="text-white active:text-white hover:text-white hover:underline"
              >
                GitHub Project
              </Link>
            </div>
            <div className="flex items-center gap-[20px]">
              <div className="min-w-[50px] min-h-[50px] rounded-full border border-white flex items-center justify-center">
                <img src={telegram} alt="telegram" />
              </div>
              <Link
                to="#"
                target="_blank"
                className="text-white active:text-white hover:text-white hover:underline"
              >
                Our Contact
              </Link>
            </div>
          </div>
        </div>
        <div>
          The product is made specifically for Colosseum Solana hackathon
        </div>
      </div>
      <img src={footerLogo} alt="footerLogo" />
    </footer>
  );
};
