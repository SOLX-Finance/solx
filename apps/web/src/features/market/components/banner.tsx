import cryptoNews from '../../../assets/logo/crypto-news.svg';
import discoverDapps from '../../../assets/logo/discover-dapps.svg';

export const Banner = () => {
  return (
    <div className="grid grid-cols-3 gap-[20px]">
      <div className="md:col-span-2 col-span-3">
        <div
          className="w-full h-[360px] min-h-[200px] bg-[#BA8FFF] rounded-[40px] relative bg-cover bg-no-repeat bg-right-top"
          style={{ backgroundImage: `url(${cryptoNews})` }}
        >
          <div className="absolute bottom-[30px] left-[30px] text-white text-[40px] font-semibold">
            Crypto
            <br />
            News
          </div>
        </div>
      </div>
      <div className="max-md:hidden">
        <div
          className="w-full h-[360px] min-h-[200px] bg-black rounded-[40px] relative bg-cover bg-no-repeat bg-left-top"
          style={{ backgroundImage: `url(${discoverDapps})` }}
        >
          <div className="absolute bottom-[30px] left-[30px] text-white text-[40px] font-semibold">
            Discover
            <br />
            Dapps
          </div>
        </div>
      </div>
    </div>
  );
};
