import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'wordSmart_sr_v1';

export type SRCardState = {
  id: number; // word id OR analogy sl
  type: 'word' | 'analogy';
  easeFactor: number; // 1.3 to 2.5+
  interval: number; // days
  repetitions: number; // consecutive correct
  dueDate: string; // ISO date
  lastReviewed: string | null;
  correctCount: number;
  wrongCount: number;
};

type SRStore = Record<string, SRCardState>; // key: `${type}-${id}`

export function useSpacedRepetition() {
  const [store, setStore] = useState<SRStore>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setStore(JSON.parse(raw));
    } catch (e) {
      console.error('SR load failed', e);
    }
    setLoaded(true);
  }, []);

  const persist = (next: SRStore) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  };

  const getCard = useCallback(
    (type: 'word' | 'analogy', id: number): SRCardState => {
      const key = `${type}-${id}`;
      return (
        store[key] || {
          id,
          type,
          easeFactor: 2.5,
          interval: 0,
          repetitions: 0,
          dueDate: new Date().toISOString(),
          lastReviewed: null,
          correctCount: 0,
          wrongCount: 0,
        }
      );
    },
    [store]
  );

  /**
   * SM-2 Rating:
   * - 'again' → 0 (reset)
   * - 'hard'  → 3
   * - 'easy'  → 5
   */
  const review = useCallback(
    (
      type: 'word' | 'analogy',
      id: number,
      rating: 'again' | 'hard' | 'easy'
    ) => {
      const key = `${type}-${id}`;
      const card = getCard(type, id);

      // Map rating to SM-2 quality (0-5)
      const q = rating === 'again' ? 0 : rating === 'hard' ? 3 : 5;

      let { easeFactor, interval, repetitions, correctCount, wrongCount } = card;

      if (q < 3) {
        // Failed
        repetitions = 0;
        interval = 1;
        wrongCount += 1;
      } else {
        // Success
        correctCount += 1;
        if (repetitions === 0) interval = 1;
        else if (repetitions === 1) interval = 6;
        else interval = Math.round(interval * easeFactor);
        repetitions += 1;
      }

      // Update ease factor
      easeFactor =
        easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
      if (easeFactor < 1.3) easeFactor = 1.3;

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + interval);

      const updated: SRCardState = {
        ...card,
        easeFactor,
        interval,
        repetitions,
        dueDate: dueDate.toISOString(),
        lastReviewed: new Date().toISOString(),
        correctCount,
        wrongCount,
      };

      setStore((prev) => persist({ ...prev, [key]: updated }));
      return updated;
    },
    [getCard]
  );

  const isDue = useCallback(
    (type: 'word' | 'analogy', id: number): boolean => {
      const card = getCard(type, id);
      return new Date(card.dueDate) <= new Date();
    },
    [getCard]
  );

  const getDueBuckets = useCallback(() => {
    const now = new Date();
    const buckets = {
      forgotten: 0,
      yesterday: 0,
      threeDays: 0,
      sevenDays: 0,
      thirtyDays: 0,
      total: 0,
    };

    Object.values(store).forEach((card) => {
      const due = new Date(card.dueDate);
      const daysOverdue = Math.floor(
        (now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (due > now) return; // not due yet

      buckets.total += 1;

      if (card.wrongCount >= 3) buckets.forgotten += 1;
      else if (daysOverdue <= 1) buckets.yesterday += 1;
      else if (daysOverdue <= 3) buckets.threeDays += 1;
      else if (daysOverdue <= 7) buckets.sevenDays += 1;
      else buckets.thirtyDays += 1;
    });

    return buckets;
  }, [store]);

  const resetProgress = useCallback(() => {
    setStore({});
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    store,
    loaded,
    getCard,
    review,
    isDue,
    getDueBuckets,
    resetProgress,
  };
}