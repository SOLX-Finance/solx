import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import EmptyLayout from '../components/layouts/EmptyLayout';
import MainLayout from '../components/layouts/MainLayout';

const LandingPage = lazy(() => import('../features/landing/pages/LandingPage'));
const MarketPage = lazy(() => import('../features/market/pages/MarketPage'));
const SalePage = lazy(() => import('../features/sales/pages/SalePage'));
const CreateSalePage = lazy(
  () => import('../features/sales/pages/CreateSalePage'),
);
const ProfilePage = lazy(() => import('../features/profile/pages/ProfilePage'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route element={<EmptyLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/market" element={<MarketPage />} />

          <Route path="/sales/create" element={<CreateSalePage />} />
          <Route path="/sales/:saleId" element={<SalePage />} />

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/market" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
