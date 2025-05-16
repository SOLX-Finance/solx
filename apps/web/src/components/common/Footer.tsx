import { Figma, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

import footerLogo from '../../assets/logo/footer.svg';
import logo from '../../assets/logo/logo.svg';

import { useMediaQuery } from '@/hooks/useMediaQuery';

export const Footer = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <footer
      style={{
        backgroundImage: isMobile ? "url('/footer-mobile-bg.webp')" : '',
      }}
      className="relative bg-black flex w-full justify-between text-white bg-cover bg-center xl:min-h-[600px]"
    >
      <div className="z-10 flex flex-col justify-between mx-auto md:mx-0 md:ml-10 lg:ml-0 pt-[55px] lg:pl-[100px] pb-[75px] text-center lg:text-left">
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
                rel="noopener noreferrer"
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
                rel="noopener noreferrer"
                className="text-white active:text-white hover:text-white hover:underline"
              >
                GitHub Project
              </Link>
            </div>
            <div className="flex items-center gap-[20px]">
              <div className="min-w-[50px] min-h-[50px] rounded-full border border-white flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="size-6"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                </svg>
              </div>
              <Link
                to="https://x.com/SOLX888"
                target="_blank"
                rel="noopener noreferrer"
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
      {!isMobile && (
        <img
          className="absolute w-[500px] xl:w-auto right-0 top-0"
          src={footerLogo}
          alt="footerLogo"
        />
      )}
    </footer>
  );
};
