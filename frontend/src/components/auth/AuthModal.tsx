import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay, DialogPortal } from '@/components/ui/dialog';
import { useAuthModal } from '@/store/authModalStore';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

export function AuthModal() {
  const { isOpen, mode, close, open } = useAuthModal();

  const switchToLogin = () => {
    open('login');
  };
  const switchToSignup = () => {
    open('signup');
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-background border shadow-lg">
          <DialogHeader>
            <DialogTitle>{mode === 'login' ? 'Login' : 'Create Account'}</DialogTitle>
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