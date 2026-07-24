import { Vocabulary } from '@/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { VocabularyCard } from './VocabularyCard'
import { useBookmarks } from '@/hooks/useBookmarks'

interface LetterWordsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  letter: string
  words: Vocabulary[]
  onWordClick: (word: Vocabulary) => void
}

export function LetterWordsModal({
  open,
  onOpenChange,
  letter,
  words,
  onWordClick,
}: LetterWordsModalProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Words starting with <span className="text-primary">“{letter}”</span>
          </DialogTitle>
          <p className="text-muted-foreground">{words.length} words found</p>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
          {words.map((word) => (
            <VocabularyCard
              key={word.id}
              word={word}
              onClick={onWordClick}
              isBookmarked={isBookmarked(word.id)}
              onBookmarkToggle={() => toggleBookmark(word.id)}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}