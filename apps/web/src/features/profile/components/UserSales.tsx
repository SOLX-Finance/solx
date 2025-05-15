import React from 'react';
import { Link } from 'react-router-dom';

import { useUserSales } from '../hooks/useUserSales';

import { ProjectCard } from '@/components/common/ProjectCard';

interface UserSalesProps {
  walletAddress: string;
}

const UserSales: React.FC<UserSalesProps> = ({ walletAddress }) => {
  const { sales, isLoading, error } = useUserSales(walletAddress);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  if (sales.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">You haven&apos;t created any sales yet.</p>
        <Link
          to="/sales/create"
          className="inline-block mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Create Sale
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Sales</h2>
        <Link
          to="/sales/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Create Sale
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sales.map((sale) => (
          <ProjectCard key={sale.id} {...sale} />
        ))}
      </div>
    </div>
  );
};

export default UserSales;
