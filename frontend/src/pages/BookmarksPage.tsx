import { RequireAuthOverlay } from '@/components/RequireAuthOverlay';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useVocabulary } from '@/hooks/useVocabulary';
import { VocabularyCard } from '@/components/vocabulary/VocabularyCard';
import { Loader2, Bookmark } from 'lucide-react';

export default function BookmarksPage() {
  const { bookmarks, toggleBookmark } = useBookmarks();
  const { allWords, loading } = useVocabulary();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const bookmarkedWords = allWords.filter((w) => bookmarks.includes(w.id));

  return (
    <RequireAuthOverlay featureName="Bookmarks">
      <div className="space-y-6 animate-page-fade">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
            Bookmarks
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            {bookmarkedWords.length} words saved
          </p>
        </div>

        {/* Content */}
        {bookmarkedWords.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed rounded-2xl">
            <Bookmark className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              No bookmarked words yet. Start saving your favorite words!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarkedWords.map((word) => (
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
    </RequireAuthOverlay>
  );
}