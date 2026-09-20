import { useEffect, useState } from 'react';
import { WifiOff, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      setVisible(true);
    };
    const handleOnline = () => {
      setIsOffline(false);
      setVisible(false);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    // Initial check
    if (!navigator.onLine) {
      setVisible(true);
    }

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // Auto-hide after 4 seconds
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      setVisible(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        'fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[100]',
        'px-3.5 py-2 rounded-full shadow-xl',
        'flex items-center gap-2 text-xs font-semibold',
        'bg-amber-500 text-white',
        'animate-slide-up',
        'max-w-[90vw]'
      )}
      onClick={() => setVisible(false)}
    >
      <WifiOff className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">
        {isOffline ? 'Offline mode — using cached data' : 'Back online'}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setVisible(false);
        }}
        className="ml-1 w-4 h-4 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center shrink-0"
        aria-label="Dismiss"
      >
        <X className="h-2.5 w-2.5" />
      </button>
    </div>
  );
}