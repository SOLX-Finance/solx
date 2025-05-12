import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
      <h1 className="text-5xl font-bold mb-4">Welcome to SolX</h1>
      <button
        onClick={() => navigate('/market')}
        className="mt-8 bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
      >
        Enter Now
      </button>
    </div>
  );
};

export default LandingPage;
