import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/navigation/Sidebar';
import { Header } from '../components/navigation/Header';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { MobileNav } from '../components/navigation/MobileNav';

export const MainLayout: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-dark-900 to-dark-800">
      {!isMobile && <Sidebar />}
      <div className="flex-1 ml-0 md:ml-64">
        <Header />
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
      {isMobile && <MobileNav />}
    </div>
  );
};