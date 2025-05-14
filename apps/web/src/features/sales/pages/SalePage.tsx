import React from 'react';
import { useParams } from 'react-router-dom';

import { useSale } from '../hooks/useSale';

const SalePage = () => {
  const { saleId } = useParams<{ saleId: string }>();
  const { sale, isLoading, error, previewFile, contentFile, demoFile } =
    useSale(saleId);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Sale not found
        </div>
      </div>
    );
  }

  // File types are now provided by the useSale hook

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{sale.title}</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-line">
            {sale.description}
          </p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Creator</h2>
          <p className="text-gray-700">{sale.user.name || sale.creator}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Status</h2>
          <p className="text-gray-700">
            {sale.buyer ? 'Sold' : 'Available for purchase'}
          </p>
        </div>
        {contentFile && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Content</h2>
            <p className="text-gray-700">
              This sale includes content that will be available after purchase.
            </p>
          </div>
        )}
        {demoFile && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Demo</h2>
            <p className="text-gray-700">
              This sale includes a demo that will be available after purchase.
            </p>
          </div>
        )}

        {previewFile && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Preview</h2>
            <p className="text-gray-700">This sale includes a preview</p>
          </div>
        )}
        <div>
          <h2 className="text-xl font-semibold mb-2">Created</h2>
          <p className="text-gray-700">
            {new Date(sale.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {!sale.buyer && (
        <div className="flex justify-center">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => alert('Purchase functionality not implemented yet')}
          >
            Purchase
          </button>
        </div>
      )}
    </div>
  );
};

export default SalePage;
