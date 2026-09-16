import { useAuth } from '@/contexts/AuthContext';
import { useAuthModal } from '@/store/authModalStore';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useVocabulary } from '@/hooks/useVocabulary';
import { VocabularyCard } from '@/components/vocabulary/VocabularyCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Bookmark } from 'lucide-react';

export default function BookmarksPage() {
  const { isAuthenticated } = useAuth();
  const { openModal } = useAuthModal();
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();
  const { allWords, loading } = useVocabulary();

  // Login check
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-6">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Bookmark className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">Login Required</h2>
            <p className="text-sm text-muted-foreground mb-6">
              You need to login to view and manage your bookmarks.
            </p>
            <Button
              onClick={() => openModal('login')}
              className="w-full"
            >
              Login / Sign Up
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const bookmarkedWords = allWords.filter((w) => bookmarks.includes(w.id));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Bookmarks</h2>
        <p className="text-muted-foreground">
          {bookmarkedWords.length} words saved
        </p>
      </div>

      {bookmarkedWords.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed rounded-xl">
          <Bookmark className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">
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
  );
}