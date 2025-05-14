import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getActiveSales, Sale } from '../../sales/api/salesApi';

const LoadingState = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
    {message}
  </div>
);

const EmptyState = () => (
  <div className="text-center py-10">
    <p className="text-gray-500">No sales available at the moment.</p>
  </div>
);

const SalesList = ({ sales }: { sales: Sale[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {sales.map((sale) => (
      <div
        key={sale.id}
        className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
      >
        <h2 className="text-xl font-semibold mb-2">{sale.title}</h2>
        <p
          className="text-gray-600 mb-4 overflow-hidden"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {sale.description}
        </p>
        <div className="flex justify-between items-center">
          <Link
            to={`/sales/${sale.id}`}
            className="text-indigo-600 hover:text-indigo-800"
          >
            View Details
          </Link>
          <span className="text-sm text-gray-500">
            {new Date(sale.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    ))}
  </div>
);

const MarketPage = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const salesData = await getActiveSales();
        setSales(salesData);
      } catch (err) {
        console.error('Error fetching sales:', err);
        setError('Failed to load sales. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <LoadingState />;
    }

    if (error) {
      return <ErrorState message={error} />;
    }

    if (sales.length === 0) {
      return <EmptyState />;
    }

    return <SalesList sales={sales} />;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Market</h1>
        <Link
          to="/sales/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Create Sale
        </Link>
      </div>

      {renderContent()}
    </div>
  );
};

export default MarketPage;
