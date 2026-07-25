import { useState, useEffect } from 'react';
import { login as loginService, signup as signupService, logout as logoutService, getProfile, getAccessToken } from '@/services/auth';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      getProfile()
        .then((data) => {
          setUser(data);
          setIsAuthenticated(true);
        })
        .catch(() => {
          logoutService();
          setIsAuthenticated(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    await loginService(username, password);
    const profile = await getProfile();
    setUser(profile);
    setIsAuthenticated(true);
  };

  const signup = async (username: string, email: string, password: string) => {
    await signupService(username, email, password);
    // Auto-login after signup
    const profile = await getProfile();
    setUser(profile);
    setIsAuthenticated(true);
  };

  const logout = () => {
    logoutService();
    setIsAuthenticated(false);
    setUser(null);
  };

  return { isAuthenticated, loading, user, login, signup, logout };
};