const aboutText = `SOLX is a new kind of digital marketplace — made for creators and builders who want to sell their projects, and for buyers who want peace of mind when purchasing them.\n\nOn SOLX, anyone can list a project for sale — whether it's code, a design pack, a tool, or something entirely unique. Sellers add a description, price, and optional preview, and lock a small deposit as a trust signal. This helps protect buyers from scams or misleading content.\n\nBuyers can browse, filter, and purchase using crypto. When someone buys a project, they instantly get an access NFT that lets them download the files. It's simple and secure.\n\nIf something's wrong with a purchase — like the files don't match the description or contain harmful code — buyers can file a dispute. Our platform will review the case, and if the issue is real, the buyer gets refunded from the seller's deposit.\n\nTo help keep the marketplace clean, every uploaded project is automatically scanned by AI for viruses, backdoors, or suspicious content.\n\nSOLX makes buying and selling digital projects safer, more transparent, and fair — without middlemen.`;

const AboutPage = () => {
  return (
    <div className="mx-auto py-10 px-3 md:px-0 flex flex-col items-center bg-gradient-to-br rounded-[40px] mt-10 mb-20 shadow-lg border ">
      <h1 className="text-[45px] md:text-6xl font-extrabold text-lime-300 mb-4 text-center">
        About SOLX
      </h1>
      <div className="text-black max-w-none text-start py-4 px- md:px-8">
        {aboutText.split('\n\n').map((para, idx) => (
          <p
            key={idx}
            className="mb-4 md:mb-6 leading-relaxed text-xl md:text-2xl"
          >
            {para}
          </p>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
