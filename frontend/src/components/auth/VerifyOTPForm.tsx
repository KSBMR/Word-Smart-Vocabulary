import { useState } from 'react';
import * as authApi from '@/services/authApi';
import { useAuthModal } from '@/store/authModalStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function VerifyOTPForm() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { email, setOtp: setStoreOtp, setScreen } = useAuthModal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.verifyOTP(email, otp);
      setStoreOtp(otp);
      setScreen('reset');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Verify OTP</h2>
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code sent to <strong>{email}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          placeholder="123456"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          className="text-center text-2xl font-bold tracking-[0.5em]"
          required
          disabled={loading}
          autoFocus
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </Button>
      </form>

      <p className="text-sm text-center text-muted-foreground">
        Didn't get the code?{' '}
        <button
          type="button"
          onClick={() => setScreen('forgot')}
          className="text-primary hover:underline"
        >
          Resend
        </button>
      </p>
    </div>
  );
}