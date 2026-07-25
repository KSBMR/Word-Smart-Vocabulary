import api from './api';

export const login = async (username: string, password: string) => {
  const response = await api.post('/api/token/', { username, password });
  const { access, refresh } = response.data;
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
  return response.data;
};

export const signup = async (username: string, email: string, password: string) => {
  const response = await api.post('/api/register/', { username, email, password });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const getProfile = async () => {
  const response = await api.get('/api/profile/');
  return response.data;
};

export const getAccessToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');