import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'
import Footer from './Footer'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        {/* Desktop sidebar - hidden on mobile */}
        <div className="hidden md:block">
          <Sidebar />
        </div>
        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>
      {/* Mobile bottom navigation */}
      <MobileNav />
      <Footer />
    </div>
  )
}