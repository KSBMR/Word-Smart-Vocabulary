import { useBookmarks } from '@/hooks/useBookmarks'
import { useVocabulary } from '@/hooks/useVocabulary'
import { VocabularyCard } from '@/components/vocabulary/VocabularyCard'
import { Loader2 } from 'lucide-react'

export default function BookmarksPage() {
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks()
  const { allWords, loading } = useVocabulary()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const bookmarkedWords = allWords.filter(w => bookmarks.includes(w.id))

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Bookmarks</h2>
      <p className="text-muted-foreground">
        {bookmarkedWords.length} words saved
      </p>
      {bookmarkedWords.length === 0 ? (
        <div className="p-8 text-center border rounded-lg text-muted-foreground">
          No bookmarked words yet. Start saving your favorite words!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarkedWords.map(word => (
            <VocabularyCard
              key={word.id}
              word={word}
              isBookmarked={true}
              onBookmarkToggle={() => toggleBookmark(word.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}