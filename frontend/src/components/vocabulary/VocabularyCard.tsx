import { useState } from 'react';
import { Vocabulary } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModal } from '@/store/authModalStore';
import { useSpeech } from '@/hooks/useSpeech';
import { cn } from '@/lib/utils';
import { Volume2, Bookmark } from 'lucide-react';

interface VocabularyCardProps {
  word: Vocabulary;
  isBookmarked?: boolean;
  onBookmarkToggle?: (word: Vocabulary) => void;
  showCoachMark?: boolean;
  onCoachDismiss?: () => void;
}

export function VocabularyCard({
  word,
  isBookmarked = false,
  onBookmarkToggle,
  showCoachMark = false,
  onCoachDismiss,
}: VocabularyCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { isAuthenticated } = useAuth();
  const { openModal } = useAuthModal();
  const speak = useSpeech();

  const handleCardTap = () => {
    setExpanded((prev) => !prev);
    if (showCoachMark && onCoachDismiss) {
      onCoachDismiss();
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      openModal('login');
      return;
    }
    onBookmarkToggle?.(word);
  };

  const handleListen = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(word.word);
  };

  return (
    <div className="relative mb-3">
      <div
        onClick={handleCardTap}
        className={cn(
          'relative rounded-2xl border-2 bg-card p-4 cursor-pointer',
          'transition-all duration-300 ease-out',
          expanded
            ? 'border-primary shadow-lg shadow-primary/15'
            : 'border-border hover:border-primary/40',
          showCoachMark && !expanded && 'border-primary shadow-lg shadow-primary/20'
        )}
      >
        <div className="flex items-start gap-3">
          {/* Text content */}
          <div className="flex-1 min-w-0">
            {/* Word + Badge */}
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-[17px] font-bold tracking-tight leading-tight">
                {word.word}
              </h3>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-bold tracking-wider">
                WS {word.book}
              </span>
            </div>

            {/* Pronunciation */}
            <p className="text-[10px] text-muted-foreground font-mono mb-1.5">
              {word.pronunciation}
            </p>

            {/* English Meaning */}
            <p className="text-[13px] font-medium mb-0.5 leading-snug">
              {word.englishMeaning}
            </p>

            {/* Bangla Meaning */}
            <p className="text-[11px] text-muted-foreground leading-snug">
              {word.banglaMeaning}
            </p>
          </div>

          {/* Action icons (right side stack) */}
          <div className="flex flex-col gap-1.5 shrink-0">
            <button
              onClick={handleListen}
              className={cn(
                'w-8 h-8 rounded-lg bg-muted flex items-center justify-center',
                'transition-all active:scale-90 hover:bg-muted/70'
              )}
              aria-label="Listen pronunciation"
            >
              <Volume2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleBookmark}
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center',
                'transition-all active:scale-90',
                isBookmarked
                  ? 'gradient-bg text-white shadow-md shadow-primary/30'
                  : 'bg-muted hover:bg-muted/70 text-foreground'
              )}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              <Bookmark
                className={cn('h-4 w-4', isBookmarked && 'fill-current')}
              />
            </button>
          </div>
        </div>

        {/* Peek Preview (only when collapsed) */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-300',
            expanded
              ? 'max-h-0 opacity-0 mt-0 pt-0 border-t-0'
              : 'max-h-10 opacity-75 mt-2.5 pt-2.5 border-t border-dashed border-border'
          )}
        >
          <p className="text-[11px] italic text-muted-foreground truncate">
            "{word.sentence}"
          </p>
        </div>

        {/* Expanded Content */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-400 ease-out',
            expanded ? 'max-h-[500px] opacity-100 mt-3.5' : 'max-h-0 opacity-0'
          )}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Example
          </p>
          <div className="p-3 rounded-xl bg-muted/60 border-l-[3px] border-primary mb-3">
            <p className="text-[13px] italic text-foreground/90 leading-relaxed">
              "{word.sentence}"
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span>📖 Lesson {word.lesson}</span>
            <span>•</span>
            <span>🔤 Alphabet {word.alphabet}</span>
          </div>
        </div>
      </div>

      {/* Coach Mark */}
      {showCoachMark && (
        <div
          className={cn(
            'absolute top-[calc(100%+6px)] right-3 z-30',
            'px-3 py-2 rounded-lg text-[11px] font-semibold text-white',
            'shadow-xl whitespace-nowrap',
            'animate-bounce-hint'
          )}
          style={{ background: '#0F172A' }}
        >
          👆 Tap করুন, example দেখুন
          <div
            className="absolute -top-1.5 right-5 w-2.5 h-2.5 rotate-45"
            style={{ background: '#0F172A' }}
          />
        </div>
      )}
    </div>
  );
}