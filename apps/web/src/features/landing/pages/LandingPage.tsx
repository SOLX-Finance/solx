import { Link } from 'react-router-dom';

import amylit from '../../../assets/landing/amylit.svg';
import arrowPurple from '../../../assets/landing/arrow-purple.svg';
import balls from '../../../assets/landing/balls.svg';
import box from '../../../assets/landing/box.svg';
import cat from '../../../assets/landing/cat.svg';
import dmytro from '../../../assets/landing/dmytro.svg';
import flowers from '../../../assets/landing/flowers.svg';
import hero from '../../../assets/landing/hero.svg';
import ilya from '../../../assets/landing/ilya.svg';
import kostya from '../../../assets/landing/kostya.svg';
import maxwell from '../../../assets/landing/maxwell.svg';
import mock from '../../../assets/landing/mock.png';
import mykola from '../../../assets/landing/mykola.svg';
import platform from '../../../assets/landing/platform.svg';
import platform2 from '../../../assets/landing/platform2.svg';
import vova from '../../../assets/landing/vova.svg';
import logo from '../../../assets/logo/logo.svg';

import { Footer } from '@/components/common/Footer';
import { Button } from '@/components/ui/button';

const team = [
  {
    name: 'Kostya Mospan',
    image: kostya,
    link: 'https://www.linkedin.com/in/kostya-mospan-215b601b7/',
  },
  {
    name: 'Illia Kubariev',
    image: ilya,
    link: 'https://www.linkedin.com/in/ilya-kubariev-a25bbb20b/',
  },
  {
    name: 'Mykola Lukashyn',
    image: mykola,
    link: 'https://www.linkedin.com/in/mykola-lukashyn/',
  },
  {
    name: 'Dmytro Horbatenko',
    image: dmytro,
    link: 'https://www.linkedin.com/in/dmytro-horbatenko-688a77240/',
  },
  {
    name: 'Maxwell B.',
    image: maxwell,
    link: 'https://www.linkedin.com/in/maxwell-b-0649701a4/',
  },
  {
    name: 'Volodymyr Kovalov',
    image: vova,
    link: 'https://www.linkedin.com/in/volodymyr-kovalov-929700273/',
  },
  {
    name: 'AmyLit',
    image: amylit,
    link: 'https://www.linkedin.com/in/amylit/',
  },
];

const LandingPage = () => {
  return (
    <main className="flex flex-col w-full">
      <div className="bg-black flex flex-col w-full text-white relative overflow-y-hidden">
        <img src={hero} alt="hero" className="absolute right-0 top-0" />
        <nav className="container flex items-center justify-between pt-[50px] relative">
          <div className="flex items-center gap-[20px]">
            <img src={logo} alt="logo" width={33} height={35} />
            <span className="font-brand text-[30px]">SOLX</span>
          </div>
          <div className="items-center gap-[140px] hidden lg:flex">
            <div className="text-[20px] leading-[120%]">SOLANA</div>
            <div className="text-[20px] leading-[120%]">2025 PROJECT</div>
          </div>
        </nav>
        <div className="flex flex-col container relative pb-[116px]">
          <div className="flex flex-col lg:flex-row items-center gap-[40px] mt-[400px]">
            <Link
              to="/sales/create"
              className="hover:bg-[#C4E703] rounded-[30px] bg-[#C4E703] text-black py-[20px] px-[30px] text-[18px]"
            >
              Create Project
            </Link>
            <Link
              to="/market"
              className="hover:bg-black bg-black border border-white text-white rounded-[30px] py-[20px] px-[30px] text-[18px]"
            >
              Watch Market
            </Link>
          </div>
          <div className="font-brand text-[30px] lg:text-[80px] leading-[120%] mt-[80px]">
            Solana
            <br />
            marketplace
          </div>
          <div className="max-w-[880px] text-[16px] lg:text-[20px]">
            SOLX is a{' '}
            <span role="img" aria-label="secure">
              🔐
            </span>{' '}
            secure digital marketplace where creators sell projects and buyers
            shop with confidence. Sellers list their projects — code, designs,
            tools — and lock a 💰 deposit as a trust guarantee. Buyers pay with
            crypto{' '}
            <span role="img" aria-label="crypto">
              💸
            </span>{' '}
            and receive a unique{' '}
            <span role="img" aria-label="NFT">
              🎟️
            </span>{' '}
            NFT that grants exclusive access to the files.
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-[123px] relative bg-[#C4E703] py-[30px] lg:py-0">
        <img
          src={platform}
          alt="platform"
          className="absolute left-0 top-0 h-full w-full"
        />
        <img src={mock} alt="mock" className="hidden relative lg:block" />
        <Link
          to="/sales/create"
          className="hover:bg-black bg-black relative text-white rounded-[40px] py-[25px] lg:py-[55px] px-[90px] text-[24px] leading-[30px]"
        >
          Create Project
        </Link>
      </div>
      <div className="bg-[#BA8FFF] py-[100px]">
        <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[40px]">
          <div className="col-span-2 rounded-[40px] bg-[#A66CFF] w-full h-full border border-black overflow-hidden">
            <img
              src={flowers}
              alt="flowers"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="col-span-2 text-black row-span-2 bg-white border border-black rounded-[40px] px-[20px] py-[40px] lg:p-[80px] w-full h-full flex flex-col gap-[40px]">
            <div className="font-brand text-[30px] lg:text-[50px] leading-[140%]">
              About platform
            </div>
            <div className="text-[16px] lg:text-[20px]">
              SOLX is a{' '}
              <span role="img" aria-label="secure">
                🔐
              </span>{' '}
              secure digital marketplace where creators sell projects and buyers
              shop with confidence. Sellers list their projects — code, designs,
              tools — and lock a 💰 deposit as a trust guarantee. Buyers pay
              with crypto{' '}
              <span role="img" aria-label="crypto">
                💸
              </span>{' '}
              and receive a unique{' '}
              <span role="img" aria-label="NFT">
                🎟️
              </span>{' '}
              NFT that grants exclusive access to the files.
            </div>
            <img src={arrowPurple} alt="arrow" className="self-end" />
          </div>
          <div className="col-span-2 bg-black rounded-[40px] border border-black overflow-hidden">
            <img src={balls} alt="balls" className="h-full object-cover" />
          </div>
          <div className="bg-[#A66CFF] border border-black rounded-[40px]">
            <img src={box} alt="box" className="w-full h-full object-cover" />
          </div>
          <div className="col-span-2"></div>
          <div className="bg-black border border-black rounded-[40px]">
            <img src={cat} alt="cat" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
      <div className="bg-black w-full">
        <img
          src={platform2}
          alt="platform2"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="bg-[#BA8FFF] w-full">
        <div className="container flex flex-col py-[100px] gap-[50px] items-center justify-center">
          <div className="font-brand text-[50px] leading-[140%]">Our team</div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[40px]">
            {team.map((t) => (
              <div
                key={t.name}
                className="flex flex-col gap-[10px] w-full items-center"
              >
                <div className="w-full rounded-[40px] bg-[#453262]">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-[184px] h-[280px]"
                  />
                </div>
                <Link to={t.link} target="_blank" className="hover:underline">
                  {t.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default LandingPage;
