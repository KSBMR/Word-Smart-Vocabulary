import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background overflow-x-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 border-r border-border/60">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full min-w-0 p-4 md:p-6 lg:p-8 pb-24 md:pb-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>

      <MobileNav />
    </div>
  );
}