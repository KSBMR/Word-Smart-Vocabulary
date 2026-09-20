import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import MobileNav from './MobileNav';
import { OfflineBanner } from '@/components/OfflineBanner';

export default function AppLayout() {
  const location = useLocation();
  const [key, setKey] = useState(location.pathname);

  useEffect(() => {
    setKey(location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <aside className="hidden md:block md:fixed md:inset-y-0 md:left-0 md:w-64 md:border-r md:border-border/60 md:bg-background md:z-40">
        <Sidebar />
      </aside>

      <MobileHeader />

      <div className="md:ml-64">
        <main className="p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto" key={key}>
            <Outlet />
          </div>
        </main>
      </div>

      <MobileNav />
      <OfflineBanner />
    </div>
  );
}