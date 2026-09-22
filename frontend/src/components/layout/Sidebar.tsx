import { NavLink, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuthModal } from '@/store/authModalStore';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

import { Logo } from '@/components/Logo';

interface SidebarProps {
  onNavigate?: () => void;
}

const navItems = [
  { to: '/', label: 'Home', emoji: '🏠' },
  { to: '/vocabulary', label: 'Vocabulary', emoji: '📚' },
  { to: '/analogy', label: 'Analogy', emoji: '🔗' }, 
  // { to: '/assessment', label: 'Assessment', emoji: '🎙️' },
  { to: '/ai-agent', label: 'AI Coach', emoji: '✨' },
  { to: '/quiz', label: 'Quiz', emoji: '🧠' },
  { to: '/revision', label: 'Revision', emoji: '🔄' },
  { to: '/bookmarks', label: 'Bookmarks', emoji: '🔖' },
  { to: '/progress', label: 'Progress', emoji: '📊' },
  { to: '/settings', label: 'Settings', emoji: '⚙️' },
];

export default function Sidebar({ onNavigate }: SidebarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const { openModal } = useAuthModal();

  const handleNavigate = () => {
    onNavigate?.();
  };

  return (
    <nav className="flex h-full flex-col p-3 gap-0.5 overflow-y-auto">
      {/* Logo */}
    <Link
      to="/"
      onClick={handleNavigate}
      className="px-3 py-2.5 mb-3 rounded-xl hover:bg-muted/60 transition-colors block"
    >
      <Logo size="md" showText={true} />
    </Link>

      {/* Nav Items */}
      <div className="space-y-0.5 flex-1">
        {navItems.map(({ to, label, emoji }) => (
          <NavLink
            key={to}
            to={to}
            onClick={handleNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'gradient-bg text-white shadow-md shadow-primary/20'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )
            }
          >
            <span className="text-lg leading-none">{emoji}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </div>

      {/* Bottom Section: Theme + User */}
      <div className="mt-4 space-y-2 pt-3 border-t border-border/60">
        {/* Theme Toggle */}
        <button
          onClick={() =>
            setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
          }
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
        >
          <span className="text-lg leading-none">
            {resolvedTheme === 'dark' ? '☀️' : '🌙'}
          </span>
          <span>
            {resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>

        {/* User / Login */}
        {isAuthenticated ? (
          <div className="p-3 rounded-xl bg-muted/60 border border-border/60">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold shrink-0">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">
                  {user?.username || 'User'}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                handleNavigate();
              }}
              className="w-full flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        ) : (
          <Button
            onClick={() => {
              openModal('login');
              handleNavigate();
            }}
            className="w-full gradient-bg hover:opacity-90 text-white shadow-md shadow-primary/20 gap-2 h-10 rounded-xl"
          >
            <User className="h-4 w-4" />
            Login / Sign Up
          </Button>
        )}
      </div>
    </nav>
  );
}