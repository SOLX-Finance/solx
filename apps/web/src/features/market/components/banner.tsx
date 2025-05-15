import cryptoNews from '../../../assets/logo/crypto-news.svg';
import discoverDapps from '../../../assets/logo/discover-dapps.svg';

export const Banner = () => {
  return (
    <div className="grid grid-cols-3 gap-[20px]">
      <div className="col-span-2">
        <div className="w-full h-[360px] min-h-[200px] bg-[#BA8FFF] rounded-[40px] relative">
          <img src={cryptoNews} alt="news" className="absolute right-0 top-0" />
          <div className="absolute bottom-[30px] left-[30px] text-white text-[40px] font-semibold">
            Crypto
            <br />
            News
          </div>
        </div>
      </div>
      <div>
        <div className="w-full h-[360px] min-h-[200px] bg-black rounded-[40px] relative">
          <img
            src={discoverDapps}
            alt="dapps"
            className="absolute right-0 top-0"
          />
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
