import { useState, useEffect, useCallback, useRef } from 'react';

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const changeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleChange = () => {
      if (changeTimeoutRef.current) {
        clearTimeout(changeTimeoutRef.current);
      }
      changeTimeoutRef.current = setTimeout(() => {
        setIsFullscreen(!!document.fullscreenElement);
      }, 150);
    };

    document.addEventListener('fullscreenchange', handleChange);
    document.addEventListener(
      'webkitfullscreenchange',
      handleChange as EventListener
    );

    return () => {
      if (changeTimeoutRef.current) clearTimeout(changeTimeoutRef.current);
      document.removeEventListener('fullscreenchange', handleChange);
      document.removeEventListener(
        'webkitfullscreenchange',
        handleChange as EventListener
      );
    };
  }, []);

  const enterFullscreen = useCallback(async () => {
    const el = document.documentElement;
    try {
      if (el.requestFullscreen) {
        await el.requestFullscreen({ navigationUI: 'hide' } as any);
      } else if ((el as any).webkitRequestFullscreen) {
        (el as any).webkitRequestFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen not supported:', err);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    } catch (err) {
      console.warn('Exit fullscreen failed:', err);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  return { isFullscreen, enterFullscreen, exitFullscreen, toggleFullscreen };
}