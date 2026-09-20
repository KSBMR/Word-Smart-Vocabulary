import { useEffect } from 'react';

interface Options {
  onOption?: (key: string) => void;
  onNext?: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcuts({
  onOption,
  onNext,
  enabled = true,
}: Options) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: KeyboardEvent) => {
      // Don't trigger if typing in input
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const key = e.key.toUpperCase();

      if (['A', 'B', 'C', 'D', 'E'].includes(key)) {
        onOption?.(key);
      } else if (e.key === 'Enter') {
        onNext?.();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [enabled, onOption, onNext]);
}