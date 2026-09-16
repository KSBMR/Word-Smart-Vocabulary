import { useState, useEffect } from 'react';
import { getWeeklyActivity } from '@/services/activity';

export interface DailyActivity {
  date: string;
  words_learned_count: number;
  quiz_attempts: number;
  quiz_correct: number;
  flashcards_studied: number;
  revisions_done: number;
}

export const useWeeklyActivity = () => {
  const [data, setData] = useState<DailyActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWeeklyActivity()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
};