import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModal } from '@/store/authModalStore';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, Sun, Moon, LogOut, User } from 'lucide-react';
import Sidebar from './Sidebar';

export default function MobileHeader() {
  const { resolvedTheme, setTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { openModal } = useAuthModal();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="md:hidden sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-xl">
      <div className="flex items-center justify-between h-14 px-3">
        {/* Left: Menu + Logo + Name */}
        <div className="flex items-center gap-2 min-w-0">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl h-9 w-9 shrink-0"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <Sidebar onNavigate={() => setMenuOpen(false)} />
            </SheetContent>
          </Sheet>

          <Link
            to="/"
            className="flex items-center gap-2 min-w-0"
            onClick={() => setMenuOpen(false)}
          >
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="font-bold text-sm truncate">Word Smart</span>
          </Link>
        </div>

        {/* Right: Theme + Profile */}
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl h-9 w-9 text-base"
            onClick={() =>
              setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
            }
            aria-label="Toggle theme"
          >
            {resolvedTheme === 'dark' ? '☀️' : '🌙'}
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  <Avatar className="h-8 w-8 ring-2 ring-border/60">
                    <AvatarFallback className="gradient-bg text-white font-semibold text-xs">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 rounded-xl">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold truncate">
                      {user?.username}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              onClick={() => openModal('login')}
              className="rounded-xl gradient-bg hover:opacity-90 text-white shadow-md shadow-primary/20 gap-1.5 h-8 px-3 text-xs font-medium"
            >
              <User className="h-3.5 w-3.5" />
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}