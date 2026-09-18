import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

export default function AppLayout() {
  return (
    <>
      {/* Desktop Sidebar - fixed position, out of normal flow */}
      <aside className="hidden md:fixed md:left-0 md:top-0 md:bottom-0 md:w-64 md:border-r md:border-border/60 md:bg-background md:z-40">
        <Sidebar />
      </aside>

      {/* Main content - pushed right by sidebar on desktop */}
      <div className="md:ml-64 min-h-screen">
        <main className="p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />
    </>
  );
}