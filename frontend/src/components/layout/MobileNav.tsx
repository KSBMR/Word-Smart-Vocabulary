import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuthModal } from '@/store/authModalStore';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Home, Library, Sparkles, Brain, BarChart3, LogOut } from 'lucide-react';

const items = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/vocabulary', label: 'Words', icon: Library },
  { to: '/ai-agent', label: 'Coach', icon: Sparkles },
  { to: '/quiz', label: 'Quiz', icon: Brain },
  { to: '/progress', label: 'Stats', icon: BarChart3 },
];

export default function MobileNav() {
  const { user, isAuthenticated, logout } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const { openModal } = useAuthModal();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-xl transition-all duration-200',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={cn(
                    'w-8 h-8 flex items-center justify-center rounded-lg transition-all',
                    isActive && 'gradient-bg shadow-sm shadow-primary/30'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5',
                      isActive ? 'text-white' : ''
                    )}
                  />
                </div>
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* User / Login */}
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2">
                <Avatar className="h-7 w-7 ring-2 ring-primary/30">
                  <AvatarFallback className="gradient-bg text-white font-semibold text-[10px]">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-[10px] font-medium text-muted-foreground">
                  You
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" className="w-52 rounded-xl mb-2">
              <DropdownMenuLabel className="font-normal">
                <p className="text-sm font-semibold truncate">
                  {user?.username}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
                }
              >
                <span className="mr-2 text-base">
                  {resolvedTheme === 'dark' ? '☀️' : '🌙'}
                </span>
                <span>
                  {resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
              >
                <Link to="/settings" className="cursor-pointer">
                  <span className="mr-2">⚙️</span>
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <button
            onClick={() => openModal('login')}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2"
          >
            <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center">
              <span className="text-white text-xs font-bold">👤</span>
            </div>
            <span className="text-[10px] font-medium text-muted-foreground">
              Login
            </span>
          </button>
        )}
      </div>
    </nav>
  );
}