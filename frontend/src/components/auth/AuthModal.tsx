import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay, DialogPortal } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthModal } from '@/store/authModalStore';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

export function AuthModal() {
  const { isOpen, mode, close, open } = useAuthModal();

  const switchToLogin = () => open('login');
  const switchToSignup = () => open('signup');

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogPortal>
        {/* Blurred backdrop */}
        <DialogOverlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-background border shadow-lg">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>{mode === 'login' ? 'Login' : 'Create Account'}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={close} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          {mode === 'login' ? (
            <LoginForm onSwitchToSignup={switchToSignup} />
          ) : (
            <SignupForm onSwitchToLogin={switchToLogin} />
          )}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}