import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { SkeletonLoader } from './components/Loader';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ImageDetection = lazy(() => import('./pages/ImageDetection'));
const VideoDetection = lazy(() => import('./pages/VideoDetection'));
const History = lazy(() => import('./pages/History'));
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="p-8"><SkeletonLoader count={4} /></div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/image-detection" element={<ImageDetection />} />
        <Route path="/video-detection" element={<VideoDetection />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
