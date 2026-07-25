import { Vocabulary } from '@/types'

// In-memory cache
let vocabularyCache: Vocabulary[] | null = null
let loadingPromise: Promise<Vocabulary[]> | null = null

export async function loadVocabulary(): Promise<Vocabulary[]> {
  // Return cached if available
  if (vocabularyCache) return vocabularyCache

  // Prevent multiple concurrent requests
  if (loadingPromise) return loadingPromise

  loadingPromise = (async () => {
    try {
      // Load both JSON files
      const [res1, res2] = await Promise.all([
        fetch('/wordsmart1.json'),
        fetch('/wordsmart2.json'),
      ])

      if (!res1.ok || !res2.ok) {
        throw new Error('Failed to load vocabulary data')
      }

      const data1: Vocabulary[] = await res1.json()
      const data2: Vocabulary[] = await res2.json()

      // Merge and sort by word alphabetically
      const merged = [...data1, ...data2]
      merged.sort((a, b) => a.word.localeCompare(b.word))

      vocabularyCache = merged
      return merged
    } catch (error) {
      console.error('Error loading vocabulary:', error)
      return []
    } finally {
      loadingPromise = null
    }
  })()

  return loadingPromise
}

export function getCachedVocabulary(): Vocabulary[] {
  return vocabularyCache || []
}

export function clearCache() {
  vocabularyCache = null
}