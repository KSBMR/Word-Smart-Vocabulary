import { Vocabulary } from '@/types'
import { Bookmark, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface VocabularyCardProps {
  word: Vocabulary
  onClick?: (word: Vocabulary) => void
  isBookmarked?: boolean
  onBookmarkToggle?: (word: Vocabulary) => void
}

export function VocabularyCard({
  word,
  onClick,
  isBookmarked = false,
  onBookmarkToggle,
}: VocabularyCardProps) {
  const speak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.word)
      utterance.lang = 'en-US'
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div
      className={cn(
        'group relative rounded-xl border bg-card p-4 transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer'
      )}
      onClick={() => onClick?.(word)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-semibold truncate">{word.word}</h3>
            <Badge variant="outline" className="text-xs">
              Word Smart {word.book}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Lesson {word.lesson}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {word.pronunciation}
          </p>
          <p className="text-sm mt-1 line-clamp-2">{word.englishMeaning}</p>
          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
            {word.banglaMeaning}
          </p>
        </div>

        <div className="flex flex-col gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              speak()
            }}
          >
            <Volume2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              onBookmarkToggle?.(word)
            }}
          >
            <Bookmark
              className={cn('h-4 w-4', isBookmarked && 'fill-primary text-primary')}
            />
          </Button>
        </div>
      </div>
    </div>
  )
}