import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useSearchStore } from '@/store/searchStore';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModal } from '@/store/authModalStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Search, LogOut, X } from 'lucide-react';
import Sidebar from './Sidebar';

export default function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const { query, setQuery } = useSearchStore();
  const { user, isAuthenticated, logout } = useAuth();
  const { openModal } = useAuthModal();
  const [localQuery, setLocalQuery] = useState(query);
  const location = useLocation();

  // Search box ONLY appears on vocabulary page
  const showSearch = location.pathname === '/vocabulary';

  // Sync local input with global store
  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalQuery(value);
    setQuery(value);
  };

  const clearSearch = () => {
    setLocalQuery('');
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      clearSearch();
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-2xl">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        {/* Left: Mobile Menu + Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl md:hidden hover:bg-muted"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <Sidebar />
            </SheetContent>
          </Sheet>

          {/* Logo (mobile only, since desktop has sidebar logo) */}
          <Link
            to="/"
            className="md:hidden flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="font-bold text-sm tracking-tight">Word Smart</span>
          </Link>
        </div>

        {/* Center: Search (Vocabulary page only) */}
        <div className="flex-1 flex justify-center">
          {showSearch && (
            <div className="relative w-full max-w-md animate-fade-in">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Search words, meanings, sentences..."
                className="pl-10 pr-10 h-10 rounded-xl bg-muted/60 border-border/60 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:bg-background transition-all"
                value={localQuery}
                onChange={handleSearch}
                onKeyDown={handleKeyDown}
              />
              {localQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/30 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="rounded-xl hover:bg-muted transition-all"
            title="Toggle theme"
          >
            <span className="text-lg">{resolvedTheme === 'dark' ? '☀️' : '🌙'}</span>
          </Button>

          {/* Auth */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative group focus:outline-none">
                  <div className="absolute inset-0 rounded-full gradient-bg opacity-0 group-hover:opacity-100 blur-md transition-opacity" />
                  <Avatar className="relative h-9 w-9 ring-2 ring-border/60 hover:ring-primary/60 transition-all cursor-pointer">
                    <AvatarFallback className="gradient-bg text-white font-semibold text-sm">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 rounded-xl border-border/60 shadow-xl"
              >
                <DropdownMenuLabel className="font-normal py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="gradient-bg text-white font-semibold">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {user?.username}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 rounded-lg mx-1 mb-1"
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
              className="rounded-xl gradient-bg hover:opacity-90 text-white shadow-md shadow-primary/25 gap-1.5 h-9 px-4 font-medium"
            >
              <span className="hidden sm:inline">Login</span>
              <span className="sm:hidden">Sign In</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}