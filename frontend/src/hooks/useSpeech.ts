import { useCallback, useEffect, useRef } from 'react';

export function useSpeech() {
  const voicesLoaded = useRef(false);

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;

    // If voices not loaded yet, wait and retry
    if (!voicesLoaded.current) {
      window.speechSynthesis.getVoices(); // triggers loading
      const checkVoices = () => {
        if (window.speechSynthesis.getVoices().length > 0) {
          voicesLoaded.current = true;
          speak(text); // retry
        } else {
          setTimeout(checkVoices, 50);
        }
      };
      checkVoices();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }, []);

  // Preload voices on mount
  useEffect(() => {
    if (window.speechSynthesis) {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        voicesLoaded.current = true;
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          voicesLoaded.current = true;
        };
      }
    }
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  return speak;
}