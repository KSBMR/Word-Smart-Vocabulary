import { create } from 'zustand';

export type AuthScreen = 'login' | 'signup' | 'forgot' | 'verify' | 'reset';

interface AuthModalState {
  isOpen: boolean;
  screen: AuthScreen;
  email: string;
  otp: string;
  openModal: (screen?: AuthScreen) => void;
  closeModal: () => void;
  setScreen: (screen: AuthScreen) => void;
  setEmail: (email: string) => void;
  setOtp: (otp: string) => void;
}

export const useAuthModal = create<AuthModalState>((set) => ({
  isOpen: false,
  screen: 'login',
  email: '',
  otp: '',
  openModal: (screen = 'login') => set({ isOpen: true, screen }),
  closeModal: () =>
    set({ isOpen: false, screen: 'login', email: '', otp: '' }),
  setScreen: (screen) => set({ screen }),
  setEmail: (email) => set({ email }),
  setOtp: (otp) => set({ otp }),
}));