import { useState, useEffect } from 'react';

const STORAGE_KEY = 'wordSmart_analogyProgress_v1';

interface Progress {
  correct: number[];
  wrong: number[];
  seen: number[];
}

const initial: Progress = { correct: [], wrong: [], seen: [] };

export function useAnalogyProgress() {
  const [progress, setProgress] = useState<Progress>(initial);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setProgress(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const save = (next: Progress) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  };

  const markCorrect = (sl: number) => {
    setProgress((prev) => {
      const next: Progress = {
        correct: [...new Set([...prev.correct, sl])],
        wrong: prev.wrong.filter((x) => x !== sl),
        seen: [...new Set([...prev.seen, sl])],
      };
      return save(next);
    });
  };

  const markWrong = (sl: number) => {
    setProgress((prev) => {
      const next: Progress = {
        correct: prev.correct.filter((x) => x !== sl),
        wrong: [...new Set([...prev.wrong, sl])],
        seen: [...new Set([...prev.seen, sl])],
      };
      return save(next);
    });
  };

  const resetProgress = () => {
    setProgress(initial);
    localStorage.removeItem(STORAGE_KEY);
  };

  const getStatus = (sl: number): 'correct' | 'wrong' | 'seen' | 'new' => {
    if (progress.correct.includes(sl)) return 'correct';
    if (progress.wrong.includes(sl)) return 'wrong';
    if (progress.seen.includes(sl)) return 'seen';
    return 'new';
  };

  return {
    progress,
    markCorrect,
    markWrong,
    resetProgress,
    getStatus,
    correctCount: progress.correct.length,
    wrongCount: progress.wrong.length,
  };
}