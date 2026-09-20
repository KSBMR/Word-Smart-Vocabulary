import { useState, useEffect, useRef } from 'react'
import { useVocabulary } from '@/hooks/useVocabulary'
import { useBookmarks } from '@/hooks/useBookmarks'
import { VocabularyCard } from '@/components/vocabulary/VocabularyCard'
import { WordDetailsModal } from '@/components/vocabulary/WordDetailsModal'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Grid2X2,
  List,
  Loader2,
  ArrowUp,
  Search,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Vocabulary } from '@/types'
import { useCoachMark } from '@/hooks/useCoachMark'
import { useIsMobile } from '@/hooks/useIsMobile'
import { FullscreenButton } from '@/components/FullscreenButton';



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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedWord, setSelectedWord] = useState<Vocabulary | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [letterPickerOpen, setLetterPickerOpen] = useState(false)
  const [showTopButton, setShowTopButton] = useState(false)
  const groupRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const { shouldShowCoachMark, dismissCoachMark } = useCoachMark()
  const isMobile = useIsMobile()

  // Back to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Group words
  const groupedWords: { [key: string]: Vocabulary[] } = {}
  words.forEach((w) => {
    const letter = w.alphabet || w.word[0].toUpperCase()
    if (!groupedWords[letter]) groupedWords[letter] = []
    groupedWords[letter].push(w)
  })

  const orderedLetters = Object.keys(groupedWords).sort((a, b) => {
    if (sortBy === 'reverse') return b.localeCompare(a)
    return a.localeCompare(b)
  })

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
      const offset = 80
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
    setLetterPickerOpen(false)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const hasWordsForLetter = (letter: string) =>
    groupedWords[letter] && groupedWords[letter].length > 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-page-fade">
      {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center justify-between gap-2 w-full sm:w-auto">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                Vocabulary
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                {filteredCount} words
                {searchQuery && ` (filtered)`}
                {!searchQuery && ` · ${totalWords} total`}
              </p>
            </div>
            <FullscreenButton className="md:hidden" />
          </div>

          <div className="flex items-center gap-2">
            {/* Grid/List toggle – desktop only */}
                {!isMobile && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className={cn(
                        'rounded-xl',
                        viewMode === 'grid' &&
                          'gradient-bg text-white border-0 hover:opacity-90'
                      )}
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid2X2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className={cn(
                        'rounded-xl',
                        viewMode === 'list' &&
                          'gradient-bg text-white border-0 hover:opacity-90'
                      )}
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                )}
            <FullscreenButton className="hidden md:flex" />
          </div>
        </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search words, meanings, sentences..."
            className="pl-9 pr-9 h-10 rounded-xl bg-muted/60 border-border/60"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/30 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <Select
            value={selectedBook === 'all' ? 'all' : String(selectedBook)}
            onValueChange={(val) =>
              setSelectedBook(val === 'all' ? 'all' : (Number(val) as 1 | 2))
            }
          >
            <SelectTrigger className="w-[140px] rounded-xl bg-muted/60 border-border/60">
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
            <SelectTrigger className="w-[140px] rounded-xl bg-muted/60 border-border/60">
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

      {/* Word List with Alphabet Grouping */}
      {orderedLetters.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            No words found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orderedLetters.map((letter, letterIndex) => (
            <div key={letter} className="scroll-mt-24">
              {/* Sticky Letter Heading */}
              <div className="sticky top-0 z-20 bg-background md:bg-background/95 md:backdrop-blur-sm py-2 -mx-2 px-2">
                <h3
                  className="text-3xl font-bold text-muted-foreground/50 cursor-pointer hover:text-primary transition-colors inline-block"
                  onClick={() => setLetterPickerOpen(true)}
                  title="Jump to letter"
                >
                  {letter}
                </h3>
              </div>

              <div
                ref={(el) => (groupRefs.current[letter] = el)}
                className={cn(
                  'mt-2',
                  isMobile
                    ? 'flex flex-col'
                    : viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                      : 'space-y-3'
                )}
              >
                {groupedWords[letter].map((word, wordIndex) => (
                  <VocabularyCard
                    key={word.id}
                    word={word}
                    isBookmarked={isBookmarked(word.id)}
                    onBookmarkToggle={() => toggleBookmark(word.id)}
                    onClick={openWordDetails}
                    showCoachMark={
                      isMobile &&
                      shouldShowCoachMark &&
                      letterIndex === 0 &&
                      wordIndex === 0
                    }
                    onCoachDismiss={dismissCoachMark}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Back to Top */}
      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 md:bottom-6 right-6 z-50 w-12 h-12 rounded-full gradient-bg text-white shadow-lg shadow-primary/30 hover:scale-110 hover:shadow-primary/50 transition-all flex items-center justify-center"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      {/* Word Details Modal – DESKTOP ONLY */}
      {!isMobile && (
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
        />
      )}

      {/* Jump to Letter Dialog */}
      <Dialog open={letterPickerOpen} onOpenChange={setLetterPickerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Jump to Letter</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-6 gap-2 p-2">
            {ALPHABETS.map((letter) => {
              const hasWords = hasWordsForLetter(letter)
              return (
                <button
                  key={letter}
                  onClick={() => hasWords && scrollToLetter(letter)}
                  disabled={!hasWords}
                  className={cn(
                    'aspect-square rounded-full text-sm font-bold transition-all flex items-center justify-center',
                    hasWords
                      ? 'hover:bg-primary hover:text-white hover:scale-110 text-foreground'
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