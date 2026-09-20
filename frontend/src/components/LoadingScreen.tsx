import { useEffect, useState } from 'react';
import { Logo } from '@/components/Logo';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingScreen({
  message = 'Loading...',
  fullScreen = true,
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => (p >= 90 ? 90 : p + Math.random() * 15));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`${
        fullScreen ? 'fixed inset-0' : 'relative w-full min-h-[60vh]'
      } flex items-center justify-center z-50 bg-background`}
    >
      <div className="flex flex-col items-center gap-6 px-6 max-w-sm w-full">
        {/* Animated Logo (same as sidebar) */}
        <Logo size="xl" showText={false} animated={true} />

        {/* Brand name */}
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight">
            Word Smart
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Vocabulary Learning
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs">
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full gradient-bg rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[11px] text-center text-muted-foreground mt-2">
            {message}
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce-dot" />
          <span
            className="w-2 h-2 rounded-full bg-primary animate-bounce-dot"
            style={{ animationDelay: '0.15s' }}
          />
          <span
            className="w-2 h-2 rounded-full bg-primary animate-bounce-dot"
            style={{ animationDelay: '0.3s' }}
          />
        </div>
      </div>
    </div>
  );
}