import { useState, useEffect, useMemo } from 'react'
import { Vocabulary } from '@/types'
import { loadVocabulary } from '@/services/VocabularyService'

type SortOption = 'alphabetical' | 'reverse' | 'random'

export function useVocabulary() {
  const [allWords, setAllWords] = useState<Vocabulary[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBook, setSelectedBook] = useState<1 | 2 | 'all'>('all')
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical')

  // Load data on mount
  useEffect(() => {
    loadVocabulary().then((data) => {
      setAllWords(data)
      setLoading(false)
    })
  }, [])

  // Filter and sort words
  const filteredWords = useMemo(() => {
    let result = [...allWords]

    // Filter by book
    if (selectedBook !== 'all') {
      result = result.filter((w) => w.book === selectedBook)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase()
      result = result.filter(
        (w) =>
          w.word.toLowerCase().includes(query) ||
          w.englishMeaning.toLowerCase().includes(query) ||
          w.banglaMeaning.toLowerCase().includes(query) ||
          w.sentence.toLowerCase().includes(query)
      )
    }

    // Sort
    switch (sortBy) {
      case 'alphabetical':
        result.sort((a, b) => a.word.localeCompare(b.word))
        break
      case 'reverse':
        result.sort((a, b) => b.word.localeCompare(a.word))
        break
      case 'random':
        result = result.sort(() => Math.random() - 0.5)
        break
      case 'newest':
        result.sort((a, b) => b.id - a.id)
        break
    }

    return result
  }, [allWords, searchQuery, selectedBook, sortBy])

  // Get unique alphabets for filter
  const alphabets = useMemo(() => {
    const set = new Set(allWords.map((w) => w.alphabet))
    return Array.from(set).sort()
  }, [allWords])

  return {
    words: filteredWords,
    allWords,
    loading,
    searchQuery,
    setSearchQuery,
    selectedBook,
    setSelectedBook,
    sortBy,
    setSortBy,
    alphabets,
    totalWords: allWords.length,
    filteredCount: filteredWords.length,
  }
}
