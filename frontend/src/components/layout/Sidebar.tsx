import { NavLink, Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuthModal } from '@/store/authModalStore';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { LogOut, User, Lock, Sparkles } from 'lucide-react';

interface SidebarProps {
  onNavigate?: () => void;
}

// ============== PUBLIC ITEMS (No login required) ==============
const publicItems = [
  { to: '/', label: 'Home', emoji: '🏠' },
  { to: '/vocabulary', label: 'Vocabulary', emoji: '📚' },
  { to: '/analogy', label: 'Analogy', emoji: '🔗' },
  { to: '/quiz', label: 'Quiz', emoji: '🧠' },
  { to: '/settings', label: 'Settings', emoji: '⚙️' },
];

// ============== PROTECTED ITEMS (Login required) ==============
const protectedItems = [
  { to: '/ai-agent', label: 'AI Coach', emoji: '🎙️' },
  { to: '/flashcards', label: 'Flashcards', emoji: '🎴' },
  { to: '/revision', label: 'Revision', emoji: '🔄' },
  { to: '/bookmarks', label: 'Bookmarks', emoji: '🔖' },
  { to: '/progress', label: 'Progress', emoji: '📊' },
];

export default function Sidebar({ onNavigate }: SidebarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const { openModal } = useAuthModal();
  const location = useLocation();

  const handleNavigate = () => onNavigate?.();

  const handleProtectedClick = (
    e: React.MouseEvent,
    path: string
  ) => {
    if (!isAuthenticated) {
      e.preventDefault();
      openModal('login');
      return;
    }
    // Let NavLink handle navigation
  };

  return (
    <nav className="flex h-full flex-col p-3 gap-0.5 overflow-y-auto">
      {/* ============ LOGO ============ */}
      <Link
        to="/"
        onClick={handleNavigate}
        className="px-3 py-2.5 mb-3 rounded-xl hover:bg-muted/60 transition-colors block"
      >
        <Logo size="md" showText={true} />
      </Link>

      {/* ============ PUBLIC ITEMS ============ */}
      <div className="space-y-0.5">
        {publicItems.map(({ to, label, emoji }) => (
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

      {/* ============ SECTION DIVIDER ============ */}
      {!isAuthenticated && (
        <div className="my-3 px-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-border/60" />
            <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/70">
              <Lock className="h-2.5 w-2.5" />
              Login Required
            </div>
            <div className="h-px flex-1 bg-border/60" />
          </div>
        </div>
      )}

      {/* ============ PROTECTED ITEMS ============ */}
      <div className="space-y-0.5">
        {protectedItems.map(({ to, label, emoji }) => {
          const isActive = location.pathname === to;

          return (
            <NavLink
              key={to}
              to={to}
              onClick={(e) => handleProtectedClick(e, to)}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive && isAuthenticated
                  ? 'gradient-bg text-white shadow-md shadow-primary/20'
                  : isAuthenticated
                    ? 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    : 'text-muted-foreground/50 hover:bg-muted/50 cursor-pointer'
              )}
            >
              <span className="text-lg leading-none">{emoji}</span>
              <span className="flex-1">{label}</span>

              {/* Lock icon — only when logged out */}
              {!isAuthenticated && (
                <span className="shrink-0 w-4 h-4 rounded-full bg-muted flex items-center justify-center">
                  <Lock className="h-2.5 w-2.5 text-muted-foreground" />
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* ============ PROMO CARD (logged out) ============== */}
      {!isAuthenticated && (
        <div className="mt-4 relative overflow-hidden rounded-2xl p-3.5 gradient-bg text-white shadow-lg shadow-primary/20">
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">
                Unlock All
              </span>
            </div>
            <p className="text-xs font-semibold mb-3 leading-snug">
              Login to unlock AI Coach, Flashcards & more
            </p>
            <button
              onClick={() => {
                openModal('login');
                handleNavigate();
              }}
              className="w-full py-2 rounded-lg bg-white text-primary text-xs font-bold hover:bg-white/90 transition-colors"
            >
              Login / Sign Up
            </button>
          </div>
          <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-white/10" />
          <div className="absolute -right-2 -top-8 w-14 h-14 rounded-full bg-white/5" />
        </div>
      )}

      {/* ============ THEME + USER ============ */}
      <div className="mt-auto pt-3 space-y-2 border-t border-border/60">
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

        {/* User Card (logged in) */}
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