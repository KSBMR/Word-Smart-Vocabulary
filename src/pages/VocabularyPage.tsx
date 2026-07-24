import { useState, useEffect, useRef } from 'react'
import { useVocabulary } from '@/hooks/useVocabulary'
import { useBookmarks } from '@/hooks/useBookmarks'
import { useSearchStore } from '@/store/searchStore'
import { VocabularyCard } from '@/components/vocabulary/VocabularyCard'
import { WordDetailsModal } from '@/components/vocabulary/WordDetailsModal'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Grid2X2, List, Loader2, ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Vocabulary } from '@/types'

const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function VocabularyPage() {
  const {
    words,
    loading,
    searchQuery,
    setSearchQuery,
    selectedBook,
    setSelectedBook,
    sortBy,
    setSortBy,
    totalWords,
    filteredCount,
  } = useVocabulary()

  const { isBookmarked, toggleBookmark } = useBookmarks()
  const { query: globalQuery, setQuery: setGlobalQuery } = useSearchStore()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedWord, setSelectedWord] = useState<Vocabulary | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [letterPickerOpen, setLetterPickerOpen] = useState(false)
  const groupRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const topRef = useRef<HTMLDivElement>(null)
  const [showTopButton, setShowTopButton] = useState(false)

  // Sync global search with local search
  useEffect(() => {
    if (globalQuery && globalQuery !== searchQuery) {
      setSearchQuery(globalQuery)
    }
  }, [globalQuery, searchQuery, setSearchQuery])

  // Handle scroll for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchQuery(val)
    setGlobalQuery(val)
  }

  // Group all words by alphabet (no filtering)
  const groupedWords: { [key: string]: Vocabulary[] } = {}
  words.forEach((w) => {
    const letter = w.alphabet || w.word[0].toUpperCase()
    if (!groupedWords[letter]) groupedWords[letter] = []
    groupedWords[letter].push(w)
  })

  // Sort groups
  const orderedLetters = Object.keys(groupedWords).sort((a, b) => {
    if (sortBy === 'reverse') return b.localeCompare(a)
    return a.localeCompare(b)
  })

  // Sort words inside groups
  orderedLetters.forEach((letter) => {
    groupedWords[letter].sort((a, b) => {
      if (sortBy === 'reverse') return b.word.localeCompare(a.word)
      return a.word.localeCompare(b.word)
    })
  })

  const openWordDetails = (word: Vocabulary) => {
    setSelectedWord(word)
    setModalOpen(true)
  }

  const scrollToLetter = (letter: string) => {
    const el = groupRefs.current[letter]
    if (el) {
      const offset = 80 // header height
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
    setLetterPickerOpen(false)
  }

  const openLetterPicker = () => {
    setLetterPickerOpen(true)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div ref={topRef} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vocabulary</h2>
          <p className="text-muted-foreground">
            {words.length} words
            {searchQuery && ` (filtered by search)`}
            {selectedBook !== 'all' && ` in Book ${selectedBook}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid2X2 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search words, meanings, sentences..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={selectedBook === 'all' ? 'all' : String(selectedBook)}
            onValueChange={(val) =>
              setSelectedBook(val === 'all' ? 'all' : (Number(val) as 1 | 2))
            }
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Book" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Books</SelectItem>
              <SelectItem value="1">Word Smart 1</SelectItem>
              <SelectItem value="2">Word Smart 2</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(val) =>
              setSortBy(val as 'alphabetical' | 'reverse' | 'random')
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alphabetical">A → Z</SelectItem>
              <SelectItem value="reverse">Z → A</SelectItem>
              <SelectItem value="random">Random</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Word Cards */}
      {orderedLetters.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No words found matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {orderedLetters.map((letter) => (
            <div
              key={letter}
              ref={(el) => (groupRefs.current[letter] = el)}
              className="scroll-mt-20"
            >
              <h3
                className="sticky top-16 bg-background z-20 text-2xl font-bold text-muted-foreground/50 py-2 cursor-pointer hover:text-primary transition-colors"
                onClick={openLetterPicker}
              >
                {letter}
              </h3>
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                    : 'space-y-2'
                }
              >
                {groupedWords[letter].map((word) => (
                  <VocabularyCard
                    key={word.id}
                    word={word}
                    onClick={openWordDetails}
                    isBookmarked={isBookmarked(word.id)}
                    onBookmarkToggle={() => toggleBookmark(word.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Back to Top Button */}
      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 z-50 bg-primary text-primary-foreground rounded-full p-3 shadow-lg hover:bg-primary/90 transition-all"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      {/* Word Details Modal */}
      <WordDetailsModal
        word={selectedWord}
        open={modalOpen}
        onOpenChange={setModalOpen}
        allWords={words}
        isBookmarked={selectedWord ? isBookmarked(selectedWord.id) : false}
        onBookmarkToggle={() => {
          if (selectedWord) {
            toggleBookmark(selectedWord.id)
          }
        }}
        onWordSelect={openWordDetails}
        onLetterClick={() => setLetterPickerOpen(true)}
      />

      {/* Letter Picker Modal */}
      <Dialog open={letterPickerOpen} onOpenChange={setLetterPickerOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Jump to Letter</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-6 gap-2 p-2">
            {ALPHABETS.map((letter) => {
              const hasWords = words.some(w => (w.alphabet || w.word[0].toUpperCase()) === letter)
              return (
                <button
                  key={letter}
                  onClick={() => hasWords && scrollToLetter(letter)}
                  disabled={!hasWords}
                  className={cn(
                    'h-10 w-10 rounded-full text-sm font-medium transition-all',
                    hasWords
                      ? 'hover:bg-primary hover:text-primary-foreground hover:scale-105'
                      : 'text-muted-foreground/30 cursor-not-allowed'
                  )}
                >
                  {letter}
                </button>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
