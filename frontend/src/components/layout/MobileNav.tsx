import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Library, Brain, BarChart3, Link2 } from 'lucide-react';

const items = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/vocabulary', label: 'Words', icon: Library },
  { to: '/analogy', label: 'Analogy', icon: Link2 }, 
  { to: '/quiz', label: 'Quiz', icon: Brain },
  { to: '/progress', label: 'Stats', icon: BarChart3 },
];

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-xl transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={cn(
                    'w-9 h-9 flex items-center justify-center rounded-xl transition-all',
                    isActive && 'gradient-bg shadow-sm shadow-primary/30'
                  )}
                >
                  <Icon
                    className={cn('h-5 w-5', isActive ? 'text-white' : '')}
                  />
                </div>
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}