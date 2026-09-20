import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import MobileNav from './MobileNav';
import { OfflineBanner } from '@/components/OfflineBanner';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function AppLayout() {
  const location = useLocation();
  const [pageLoading, setPageLoading] = useState(false);

  // Show loading screen on route change
  useEffect(() => {
    setPageLoading(true);
    const timer = setTimeout(() => setPageLoading(false), 400);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:block md:fixed md:inset-y-0 md:left-0 md:w-64 md:border-r md:border-border/60 md:bg-background md:z-40">
        <Sidebar />
      </aside>

      {/* MOBILE HEADER */}
      <MobileHeader />

      {/* MAIN CONTENT */}
      <div className="md:ml-64">
        <main className="p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto">
            {pageLoading ? (
              <LoadingScreen fullScreen={false} message="Loading page..." />
            ) : (
              <Outlet />
            )}
          </div>
        </main>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <MobileNav />

      {/* OFFLINE INDICATOR */}
      <OfflineBanner />
    </div>
  );
}