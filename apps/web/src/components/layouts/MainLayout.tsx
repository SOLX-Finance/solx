import React from 'react';
import { Outlet } from 'react-router-dom';

import { Footer } from '../common/Footer';
import Navbar from '../common/Navbar';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main className="max-w-[calc(100%-40px)] md:max-w-[calc(100%-64px)] mx-auto min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
