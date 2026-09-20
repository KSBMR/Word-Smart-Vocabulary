import { AnalogyQuestion } from '@/types';

let cache: AnalogyQuestion[] | null = null;
let loadingPromise: Promise<AnalogyQuestion[]> | null = null;

export async function loadAnalogyQuestions(): Promise<AnalogyQuestion[]> {
  if (cache) return cache;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    try {
      const res = await fetch('/analogy.json');
      if (!res.ok) throw new Error('Failed to load analogy questions');
      const data: AnalogyQuestion[] = await res.json();
      cache = data;
      return data;
    } catch (err) {
      console.error('❌ Error loading analogy questions:', err);
      return [];
    } finally {
      loadingPromise = null;
    }
  })();

  return loadingPromise;
}

export function getCachedAnalogy(): AnalogyQuestion[] {
  return cache || [];
}

export function clearAnalogyCache() {
  cache = null;
}