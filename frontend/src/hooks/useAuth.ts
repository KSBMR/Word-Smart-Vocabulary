import { useState, useEffect } from 'react';
import { login as loginService, signup as signupService, logout as logoutService, getProfile, getAccessToken } from '@/services/auth';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    // Try to verify the token, but don't log out on network error
    getProfile()
      .then((data) => {
        setUser(data);
        setIsAuthenticated(true);
        setLoading(false);
      })
      .catch((err) => {
        // If it's a network error (backend down), keep the token but mark as not authenticated
        // The interceptor will retry later
        if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
          console.warn('Backend unreachable – keeping token but not authenticated');
          setIsAuthenticated(false);
        } else {
          // Only log out on 401 or other auth errors
          logoutService();
          setIsAuthenticated(false);
        }
        setLoading(false);
      });
  }, []);

  const login = async (username: string, password: string) => {
    await loginService(username, password);
    const profile = await getProfile();
    setUser(profile);
    setIsAuthenticated(true);
  };

  const signup = async (username: string, email: string, password: string) => {
    await signupService(username, email, password);
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