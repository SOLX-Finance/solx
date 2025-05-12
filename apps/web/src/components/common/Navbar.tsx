import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  if (location.pathname === '/') {
    return null;
  }

  const isActive = (path: string) => {
    return location.pathname.startsWith(path)
      ? 'text-indigo-600 font-medium'
      : 'text-gray-600 hover:text-indigo-600';
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/market" className="text-xl font-bold text-indigo-600">
                SolX
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/market"
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  location.pathname === '/market'
                    ? 'border-indigo-500'
                    : 'border-transparent'
                } ${isActive('/market')}`}
              >
                Market
              </Link>
              <Link
                to="/projects/create"
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  location.pathname === '/projects/create'
                    ? 'border-indigo-500'
                    : 'border-transparent'
                } ${isActive('/projects/create')}`}
              >
                Create Project
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
