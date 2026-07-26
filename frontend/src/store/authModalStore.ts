import { create } from 'zustand';

type AuthModalMode = 'login' | 'signup';

interface AuthModalStore {
  isOpen: boolean;
  mode: AuthModalMode;
  open: (mode?: AuthModalMode) => void;
  close: () => void;
}

export const useAuthModal = create<AuthModalStore>((set) => ({
  isOpen: false,
  mode: 'login',
  open: (mode = 'login') => {
    // Only open if explicitly called by user action
    // We'll use a session flag to track user interaction
    if (!sessionStorage.getItem('authModal_userInitiated')) {
      console.warn('Blocked auto-open of auth modal');
      return;
    }
    set({ isOpen: true, mode });
  },
  close: () => set({ isOpen: false }),
}));

// Helper to mark user interaction (call this on button click)
export const allowAuthModal = () => {
  sessionStorage.setItem('authModal_userInitiated', 'true');
};