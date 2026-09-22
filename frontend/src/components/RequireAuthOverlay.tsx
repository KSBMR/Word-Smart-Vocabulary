import { useAuth } from '@/contexts/AuthContext';
import { useAuthModal } from '@/store/authModalStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Lock, Sparkles, LogIn } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  featureName?: string;
}

const BENEFITS = [
  { emoji: '🎙️', text: 'AI Speaking Coach' },
  { emoji: '🎴', text: 'Interactive Flashcards' },
  { emoji: '🔄', text: 'Smart Revision (SM-2)' },
  { emoji: '📊', text: 'Progress Tracking' },
  { emoji: '🔖', text: 'Bookmark Management' },
  { emoji: '🎯', text: 'Personal Learning Plan' },
];

export function RequireAuthOverlay({
  children,
  featureName = 'this feature',
}: Props) {
  const { isAuthenticated, loading } = useAuth();
  const { openModal } = useAuthModal();

  if (loading) {
    return <LoadingScreen fullScreen={false} message="Loading..." />;
  }

  // Authenticated — render children normally
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Not authenticated
  return (
    <>
      {/* Blurred preview of actual content */}
      <div
        className="blur-lg pointer-events-none select-none opacity-50"
        aria-hidden="true"
      >
        {children}
      </div>

      {/* FIXED Overlay — stays centered, doesn't scroll with content */}
      {/* md:left-64 — offset for sidebar */}
      <div
        className="fixed inset-0 md:left-64 z-40 flex items-center justify-center p-4 bg-background/70 backdrop-blur-md animate-fade-in"
      >
        <Card className="max-w-sm w-full text-center border-2 border-primary/30 shadow-2xl shadow-primary/20 bg-background">
          <div className="p-5 md:p-6">
            {/* Icon */}
            <div className="relative mx-auto mb-4 w-14 h-14 md:w-16 md:h-16">
              <div className="absolute inset-0 rounded-2xl gradient-bg opacity-25 animate-ping-slow" />
              <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/30">
                <Lock className="h-6 w-6 md:h-7 md:w-7 text-white" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-lg md:text-xl font-bold tracking-tight mb-1.5">
              Login Required
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground mb-5 leading-relaxed">
              Login or sign up to access{' '}
              <strong className="text-foreground">{featureName}</strong>.
            </p>

            {/* Benefits */}
            <div className="space-y-1.5 mb-5 text-left">
              {BENEFITS.map(({ emoji, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2.5 text-xs text-muted-foreground"
                >
                  <span className="text-sm shrink-0">{emoji}</span>
                  <span className="truncate">{text}</span>
                </div>
              ))}
            </div>

            {/* Action */}
            <Button
              onClick={() => openModal('login')}
              className="w-full gradient-bg hover:opacity-90 text-white h-11 rounded-xl gap-2 shadow-lg shadow-primary/25 font-bold"
            >
              <LogIn className="h-4 w-4" />
              Login / Sign Up
            </Button>

            <p className="text-[10px] text-muted-foreground mt-3">
              Free forever · No credit card required
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}