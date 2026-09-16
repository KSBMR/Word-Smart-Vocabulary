import { useState } from 'react';
import * as authApi from '@/services/authApi';
import { useAuthModal } from '@/store/authModalStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setScreen, setEmail: setStoreEmail } = useAuthModal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setStoreEmail(email);
      setScreen('verify');
    } catch (err: any) {
      setError('Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Forgot Password?</h2>
        <p className="text-sm text-muted-foreground">
          Enter your email and we'll send you a 6-digit OTP.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          autoFocus
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </Button>
      </form>

      <p className="text-sm text-center">
        <button
          type="button"
          onClick={() => setScreen('login')}
          className="text-primary hover:underline"
        >
          ← Back to Login
        </button>
      </p>
    </div>
  );
}