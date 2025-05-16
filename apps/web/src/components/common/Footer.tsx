import { Figma, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

import footerLogo from '../../assets/logo/footer.svg';
import logo from '../../assets/logo/logo.svg';
import telegram from '../../assets/logo/telegram.svg';

import { useMediaQuery } from '@/hooks/useMediaQuery';

export const Footer = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <footer
      style={{
        backgroundImage: isMobile ? "url('/footer-mobile-bg.webp')" : '',
      }}
      className="bg-black flex w-full justify-between text-white bg-cover bg-center"
    >
      <div className="flex flex-col justify-between pt-[55px] lg:pl-[100px] pb-[75px] text-center lg:text-left">
        <div className="flex flex-col gap-[80px] items-center lg:items-start">
          <div className="flex items-end gap-[20px]">
            <img src={logo} alt="logo" />
            <div className="font-brand text-[30px] leading-[30px]">SOLX</div>
          </div>
          <div className="flex max-md:w-[252px]  flex-col lg:flex-row gap-[40px]">
            <div className="flex items-center gap-[20px]">
              <div className="min-w-[50px] min-h-[50px] rounded-full border border-white flex items-center justify-center">
                <Figma />
              </div>
              <Link
                to="https://www.figma.com/design/5cqdLHRjf5n8G6zCRl9mRq/SOLX"
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
                to="https://github.com/SOLX-Finance/solx"
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
        <div className="mt-[100px]">
          The product is made specifically for Colosseum Solana hackathon
        </div>
      </div>
      {!isMobile && <img src={footerLogo} alt="footerLogo" />}
    </footer>
  );
};
