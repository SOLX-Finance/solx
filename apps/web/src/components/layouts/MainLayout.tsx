import React from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from '../common/Navbar';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 pt-4 min-h-screen">
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
