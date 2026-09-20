import { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    if (!navigator.onLine) setShowBanner(true);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <div
      className={cn(
        'fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-[100]',
        'px-4 py-2.5 rounded-full shadow-xl',
        'flex items-center gap-2 text-xs font-semibold',
        'animate-slide-up',
        isOnline
          ? 'bg-emerald-500 text-white'
          : 'bg-red-500 text-white'
      )}
    >
      {isOnline ? (
        <>
          <Wifi className="h-3.5 w-3.5" />
          Back online
        </>
      ) : (
        <>
          <WifiOff className="h-3.5 w-3.5" />
          You're offline — using cached data
        </>
      )}
    </div>
  );
}