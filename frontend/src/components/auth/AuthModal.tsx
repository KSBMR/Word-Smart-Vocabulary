import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useAuthModal } from '@/store/authModalStore';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import VerifyOTPForm from './VerifyOTPForm';
import ResetPasswordForm from './ResetPasswordForm';

export function AuthModal() {
  const { isOpen, screen, closeModal } = useAuthModal();

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-md p-6 bg-background/95 backdrop-blur-xl border-2 shadow-2xl">
        {/* Screen reader only title/description for accessibility */}
        <DialogHeader className="sr-only">
          <DialogTitle>Authentication</DialogTitle>
          <DialogDescription>Login or sign up to Word Smart</DialogDescription>
        </DialogHeader>

        {screen === 'login' && <LoginForm />}
        {screen === 'signup' && <SignupForm />}
        {screen === 'forgot' && <ForgotPasswordForm />}
        {screen === 'verify' && <VerifyOTPForm />}
        {screen === 'reset' && <ResetPasswordForm />}
      </DialogContent>
    </Dialog>
  );
}