import { useState, useEffect } from 'react';

const STORAGE_KEY = 'wordSmart_coachMarkSeen_v3';

export function useCoachMark() {
  const [shouldShowCoachMark, setShouldShowCoachMark] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem(STORAGE_KEY);
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setShouldShowCoachMark(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissCoachMark = () => {
    setShouldShowCoachMark(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  return { shouldShowCoachMark, dismissCoachMark };
}