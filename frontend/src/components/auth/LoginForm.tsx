import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAuthModal } from '@/store/authModalStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function LoginForm({ onSwitchToSignup }: { onSwitchToSignup?: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { close } = useAuthModal();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      close();
      navigate('/');
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Login failed. Check credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        disabled={loading}
        autoFocus
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={loading}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
      <p className="text-sm text-center text-muted-foreground">
        Don't have an account?{' '}
        <button
          type="button"
          className="text-primary hover:underline"
          onClick={onSwitchToSignup}
        >
          Sign Up
        </button>
      </p>
    </form>
  );
}