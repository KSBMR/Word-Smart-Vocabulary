// frontend/src/services/authApi.ts
import api from './api';
import { setTokens } from './auth';

// 📝 Register (Signup)
export const signup = async (username: string, email: string, password: string) => {
  const res = await api.post('/api/auth/register/', { username, email, password });
  return res.data;
};

// 🔐 Login
export const login = async (username: string, password: string) => {
  const res = await api.post('/api/auth/login/', { username, password });
  setTokens(res.data.access, res.data.refresh);
  return res.data;
};

// 📧 Forgot Password
export const forgotPassword = async (email: string) => {
  const res = await api.post('/api/auth/forgot-password/', { email });
  return res.data;
};

// ✅ Verify OTP
export const verifyOTP = async (email: string, otp: string) => {
  const res = await api.post('/api/auth/verify-otp/', { email, otp });
  return res.data;
};

// 🔄 Reset Password
export const resetPassword = async (email: string, otp: string, new_password: string) => {
  const res = await api.post('/api/auth/reset-password/', { email, otp, new_password });
  return res.data;
};

// 👤 Get Profile (for reload persistence)
export const getProfile = async () => {
  const res = await api.get('/api/profile/');
  return res.data;
};