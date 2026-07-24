export interface Vocabulary {
  id: number
  book: number
  lesson: number
  alphabet: string
  word: string
  pronunciation: string
  englishMeaning: string
  banglaMeaning: string
  sentence: string
}

export type Book = 1 | 2
export type Theme = 'light' | 'dark' | 'system'