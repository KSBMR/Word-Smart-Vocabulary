import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import MobileNav from './MobileNav';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* ============ DESKTOP SIDEBAR (always visible on md+) ============ */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:w-64 md:border-r md:border-border/60 md:bg-background md:z-40">
        <Sidebar />
      </aside>

      {/* ============ MOBILE HEADER (only on mobile) ============ */}
      <MobileHeader />

      {/* ============ MAIN CONTENT ============ */}
      <div className="md:ml-64">
        <main className="p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ============ MOBILE BOTTOM NAV ============ */}
      <MobileNav />
    </div>
  );
}