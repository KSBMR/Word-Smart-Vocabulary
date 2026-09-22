import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModal } from '@/store/authModalStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Loader2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SignupForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, login } = useAuth();
  const { setScreen, closeModal } = useAuthModal();

  // Password strength
  const passwordChecks = {
    length: password.length >= 6,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
  };
  const passwordScore = Object.values(passwordChecks).filter(Boolean).length;

  const getStrengthLabel = () => {
    if (password.length === 0) return { text: '', color: '' };
    if (passwordScore <= 1) return { text: 'Weak', color: 'text-red-500' };
    if (passwordScore === 2) return { text: 'Fair', color: 'text-amber-500' };
    if (passwordScore === 3) return { text: 'Good', color: 'text-blue-500' };
    return { text: 'Strong', color: 'text-emerald-500' };
  };

  const strength = getStrengthLabel();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signup(username, email, password);
      await login(username, password);
      closeModal();
    } catch (err: any) {
      const data = err.response?.data;
      const msg =
        data?.username?.[0] ||
        data?.email?.[0] ||
        data?.password?.[0] ||
        data?.error ||
        'Signup failed. Try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Create Account</h2>
        <p className="text-sm text-muted-foreground">
          Start your vocabulary journey
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={loading}
          autoFocus
          className="h-11 rounded-xl"
        />

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className="h-11 rounded-xl"
        />

        {/* Password with toggle */}
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="h-11 rounded-xl pr-11"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Password Strength */}
        {password.length > 0 && (
          <div className="space-y-2 px-1">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-all',
                    i <= passwordScore
                      ? passwordScore <= 1
                        ? 'bg-red-500'
                        : passwordScore === 2
                          ? 'bg-amber-500'
                          : passwordScore === 3
                            ? 'bg-blue-500'
                            : 'bg-emerald-500'
                      : 'bg-muted'
                  )}
                />
              ))}
              <span
                className={cn(
                  'text-[10px] font-bold uppercase tracking-wider ml-2 shrink-0',
                  strength.color
                )}
              >
                {strength.text}
              </span>
            </div>

            {/* Requirements */}
            <div className="grid grid-cols-2 gap-1">
              <RequirementCheck
                label="6+ chars"
                passed={passwordChecks.length}
              />
              <RequirementCheck
                label="Uppercase"
                passed={passwordChecks.hasUpper}
              />
              <RequirementCheck
                label="Lowercase"
                passed={passwordChecks.hasLower}
              />
              <RequirementCheck
                label="Number"
                passed={passwordChecks.hasNumber}
              />
            </div>
          </div>
        )}

        {/* Confirm Password with toggle */}
        <div className="relative">
          <Input
            type={showConfirm ? 'text' : 'password'}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
            className={cn(
              'h-11 rounded-xl pr-11',
              confirmPassword &&
                password &&
                (confirmPassword === password
                  ? 'border-emerald-500/50'
                  : 'border-red-500/50')
            )}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showConfirm ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Match indicator */}
        {confirmPassword.length > 0 && password.length > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] px-1">
            {confirmPassword === password ? (
              <>
                <Check className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-500 font-semibold">
                  Passwords match
                </span>
              </>
            ) : (
              <>
                <X className="h-3 w-3 text-red-500" />
                <span className="text-red-500 font-semibold">
                  Passwords do not match
                </span>
              </>
            )}
          </div>
        )}

        {error && (
          <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full h-11 rounded-xl gradient-bg hover:opacity-90 text-white font-semibold"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating account...
            </>
          ) : (
            'Sign Up'
          )}
        </Button>
      </form>

      <p className="text-sm text-center text-muted-foreground">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => setScreen('login')}
          className="text-primary hover:underline font-medium"
        >
          Login
        </button>
      </p>
    </div>
  );
}

// ==================== Requirement Check Helper ====================
function RequirementCheck({ label, passed }: { label: string; passed: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      {passed ? (
        <Check className="h-3 w-3 text-emerald-500 shrink-0" />
      ) : (
        <X className="h-3 w-3 text-muted-foreground/50 shrink-0" />
      )}
      <span
        className={cn(
          'text-[10px]',
          passed ? 'text-emerald-500' : 'text-muted-foreground'
        )}
      >
        {label}
      </span>
    </div>
  );
}