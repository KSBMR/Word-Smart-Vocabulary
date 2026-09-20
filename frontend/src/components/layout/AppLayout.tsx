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
    const t = setTimeout(() => setKey(location.pathname), 50);
    return () => clearTimeout(t);
  }, [location.pathname]);

  // Preload data files after app mounts
  useEffect(() => {
    if (!('caches' in window)) return;
    // Silently preload data files
    Promise.all([
      fetch('/wordsmart1.json').catch(() => null),
      fetch('/wordsmart2.json').catch(() => null),
      fetch('/analogy.json').catch(() => null),
    ]).then(() => {
      console.log('📦 Data files preloaded');
    });
  }, []);

  return (
    <div className="min-h-screen-safe bg-background">
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