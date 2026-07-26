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
    console.trace('🔵 AuthModal opened with mode:', mode);
    set({ isOpen: true, mode });
  },
  close: () => set({ isOpen: false }),
}));