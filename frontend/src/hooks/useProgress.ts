import { useState, useEffect } from 'react';
import { getProgress, updateProgress } from '@/services/progress';

export const useProgress = () => {
  const [learned, setLearned] = useState<number[]>([]);
  const [hard, setHard] = useState<number[]>([]);

  useEffect(() => {
    getProgress().then((data) => {
      setLearned(data.learned || []);
      setHard(Object.keys(data.progress || {}).filter(k => data.progress[k] === 'hard').map(Number));
    });
  }, []);

  const markLearned = async (wordId: number) => {
    await updateProgress(wordId, 'learned');
    setLearned(prev => prev.includes(wordId) ? prev : [...prev, wordId]);
  };

  const markHard = async (wordId: number) => {
    await updateProgress(wordId, 'hard');
    setHard(prev => prev.includes(wordId) ? prev : [...prev, wordId]);
  };

  return { learned, hard, markLearned, markHard };
};