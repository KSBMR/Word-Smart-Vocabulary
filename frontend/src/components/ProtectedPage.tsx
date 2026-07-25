import { useAuth } from '@/hooks/useAuth';
import { useAuthModal } from '@/store/authModalStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProtectedPageProps {
  children: React.ReactNode;
}

export function ProtectedPage({ children }: ProtectedPageProps) {
  const { isAuthenticated, loading } = useAuth();
  const { open } = useAuthModal();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle>Access Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You need to login or sign up to access this page.
            </p>
            <Button onClick={() => open('login')} className="w-full">
              Login / Sign Up
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}