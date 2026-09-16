import { Vocabulary } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModal } from '@/store/authModalStore';
import { Bookmark, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useSpeech } from '@/hooks/useSpeech';

interface VocabularyCardProps {
  word: Vocabulary;
  onClick?: (word: Vocabulary) => void;
  isBookmarked?: boolean;
  onBookmarkToggle?: (word: Vocabulary) => void;
}

export function VocabularyCard({
  word,
  onClick,
  isBookmarked = false,
  onBookmarkToggle,
}: VocabularyCardProps) {
  const speak = useSpeech();
  const { isAuthenticated } = useAuth();
  const { openModal } = useAuthModal();

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      openModal('login');
      return;
    }
    onBookmarkToggle?.(word);
  };

  return (
    <div
      className="group relative rounded-xl border border-border/80 bg-card p-4 hover:shadow-lg hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
      onClick={() => onClick?.(word)}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-lg font-bold tracking-tight">{word.word}</h3>
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 h-5 border-primary/30 text-primary"
          >
            Word Smart {word.book}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 -mt-1 -mr-1"
          onClick={(e) => {
            e.stopPropagation();
            speak(word.word);
          }}
        >
          <Volume2 className="h-4 w-4" />
        </Button>
      </div>

      <Badge
        variant="secondary"
        className="text-[10px] px-1.5 py-0 h-5 mb-2"
      >
        Lesson {word.lesson}
      </Badge>

      <p className="text-xs text-muted-foreground mb-2 font-mono">
        {word.pronunciation}
      </p>

      <p className="text-sm font-medium mb-1 line-clamp-2">
        {word.englishMeaning}
      </p>
      <p className="text-xs text-muted-foreground line-clamp-1">
        {word.banglaMeaning}
      </p>

      <div className="absolute bottom-3 right-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleBookmarkClick}
        >
          <Bookmark
            className={cn(
              'h-4 w-4 transition-all',
              isBookmarked && 'fill-primary text-primary'
            )}
          />
        </Button>
      </div>
    </div>
  );
}