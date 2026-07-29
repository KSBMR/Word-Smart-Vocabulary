// src/components/layout/MobileNav.tsx
import { NavLink } from 'react-router-dom';
import { Home, Library, Layers, FileQuestion, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/vocabulary', label: 'Words', icon: Library },
  { to: '/flashcards', label: 'Cards', icon: Layers },
  { to: '/quiz', label: 'Quiz', icon: FileQuestion },
  { to: '/bookmarks', label: 'Saved', icon: Bookmark },
];

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 text-xs font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}