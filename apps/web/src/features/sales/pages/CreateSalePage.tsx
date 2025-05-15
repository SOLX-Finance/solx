import React from 'react';

import CreateSaleForm from '../components/CreateSaleForm';

const CreateSalePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Create New Sale</h1>
      <CreateSaleForm />
    </div>
  );
};

export default CreateSalePage;
