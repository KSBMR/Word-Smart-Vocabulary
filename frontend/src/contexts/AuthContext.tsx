import { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '@/services/authApi';
import { getAccessToken, logout as clearTokens } from '@/services/auth';

interface User {
  username?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔄 On mount: fetch profile if token exists
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .getProfile()
      .then((data) => {
        setUser({
          username: data.username,
          email: data.email,
        });
      })
      .catch((err) => {
        console.error('Failed to load profile:', err);
        // টোকেন invalid হলে লগআউট
        clearTokens();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    const data = await authApi.login(username, password);
    setUser({ username: data.username, email: data.email });
  };

  const signup = async (username: string, email: string, password: string) => {
    await authApi.signup(username, email, password);
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};