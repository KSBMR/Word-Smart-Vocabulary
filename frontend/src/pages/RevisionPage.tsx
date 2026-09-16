import { useAuth } from '@/contexts/AuthContext';
import { useAuthModal } from '@/store/authModalStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';

export default function RevisionPage() {
  const { isAuthenticated } = useAuth();
  const { openModal } = useAuthModal();

  // Login check
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-6">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">Login Required</h2>
            <p className="text-sm text-muted-foreground mb-6">
              You need to login to access the revision system.
            </p>
            <Button
              onClick={() => openModal('login')}
              className="w-full"
            >
              Login / Sign Up
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Revision</h2>
        <p className="text-muted-foreground">
          Reinforce your memory with spaced repetition.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 text-center py-12">
          <RefreshCw className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-1">Coming Soon</h3>
          <p className="text-sm text-muted-foreground">
            The revision system is under development.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}