import { useState, useEffect } from 'react';
import { login as loginService, signup as signupService, logout as logoutService, getAccessToken } from '@/services/auth';
import { useProfile } from './useProfile';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { data: user, isLoading: profileLoading, refetch } = useProfile();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }
    refetch().then(({ data }) => {
      if (data) {
        setIsAuthenticated(true);
      } else {
        logoutService();
        setIsAuthenticated(false);
      }
      setLoading(false);
    }).catch(() => {
      logoutService();
      setIsAuthenticated(false);
      setLoading(false);
    });
  }, []);

  const login = async (username: string, password: string) => {
    await loginService(username, password);
    const profile = await refetch();
    if (profile.data) {
      setIsAuthenticated(true);
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    await signupService(username, email, password);
    const profile = await refetch();
    if (profile.data) {
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    logoutService();
    setIsAuthenticated(false);
  };

  return { isAuthenticated, loading, user, login, signup, logout };
};