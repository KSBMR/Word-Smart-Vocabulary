import { useState, useEffect } from 'react'

const STORAGE_KEY = 'wordSmart_bookmarks'

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks))
  }, [bookmarks])

  const toggleBookmark = (wordId: number) => {
    setBookmarks(prev =>
      prev.includes(wordId) ? prev.filter(id => id !== wordId) : [...prev, wordId]
    )
  }

  const isBookmarked = (wordId: number) => bookmarks.includes(wordId)

  return { bookmarks, toggleBookmark, isBookmarked }
}