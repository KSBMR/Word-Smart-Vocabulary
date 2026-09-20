import { useState, useEffect } from 'react';

export function useCoachMark(storageKey = 'wordSmart_coachMarkSeen_v3') {
  const [shouldShowCoachMark, setShouldShowCoachMark] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem(storageKey);
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setShouldShowCoachMark(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [storageKey]);

  const dismissCoachMark = () => {
    setShouldShowCoachMark(false);
    localStorage.setItem(storageKey, 'true');
  };

  return { shouldShowCoachMark, dismissCoachMark };
}