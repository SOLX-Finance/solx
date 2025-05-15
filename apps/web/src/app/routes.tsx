import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import EmptyLayout from '../components/layouts/EmptyLayout';
import MainLayout from '../components/layouts/MainLayout';

const LandingPage = lazy(() => import('../features/landing/pages/LandingPage'));
const MarketPage = lazy(() => import('../features/market/pages/MarketPage'));
const ProjectPage = lazy(() => import('../features/project/pages/ProjectPage'));
const CreateProjectPage = lazy(
  () => import('../features/project/pages/CreateProjectPage'),
);
const MyProfilePage = lazy(
  () => import('../features/profile/pages/MyProfilePage'),
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

          <Route path="/projects/create" element={<CreateProjectPage />} />
          <Route path="/projects/:projectId" element={<ProjectPage />} />

          <Route path="/profile" element={<MyProfilePage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/market" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
