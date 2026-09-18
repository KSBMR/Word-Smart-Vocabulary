import { useState } from 'react';
import { Vocabulary } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModal } from '@/store/authModalStore';
import { useSpeech } from '@/hooks/useSpeech';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/lib/utils';
import { Volume2, Bookmark } from 'lucide-react';

interface VocabularyCardProps {
  word: Vocabulary;
  isBookmarked?: boolean;
  onBookmarkToggle?: (word: Vocabulary) => void;
  onClick?: (word: Vocabulary) => void;
  showCoachMark?: boolean;
  onCoachDismiss?: () => void;
}

export function VocabularyCard({
  word,
  isBookmarked = false,
  onBookmarkToggle,
  onClick,
  showCoachMark = false,
  onCoachDismiss,
}: VocabularyCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { isAuthenticated } = useAuth();
  const { openModal } = useAuthModal();
  const speak = useSpeech();
  const isMobile = useIsMobile();

  const handleCardTap = () => {
    if (isMobile) {
      // Mobile: expand inline
      setExpanded((prev) => !prev);
      if (showCoachMark && onCoachDismiss) {
        onCoachDismiss();
      }
    } else {
      // Desktop: open modal
      onClick?.(word);
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

  // ============================================================
  // MOBILE VERSION (tap to expand)
  // ============================================================
  if (isMobile) {
    return (
      <div className="relative mb-3">
        <div
          onClick={handleCardTap}
          className={cn(
            'relative rounded-2xl border-2 bg-card p-4 cursor-pointer gpu-accelerate',
            'transition-[border-color,box-shadow] duration-200 ease-out',  // ← শুধু border ও shadow animate
            expanded
              ? 'border-primary shadow-lg shadow-primary/15'
              : 'border-border',
            showCoachMark && !expanded && 'border-primary shadow-lg shadow-primary/20'
          )}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="text-[17px] font-bold tracking-tight leading-tight">
                  {word.word}
                </h3>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-bold tracking-wider">
                  WS {word.book}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground font-mono mb-1.5">
                {word.pronunciation}
              </p>
              <p className="text-[13px] font-medium mb-0.5 leading-snug">
                {word.englishMeaning}
              </p>
              <p className="text-[11px] text-muted-foreground leading-snug">
                {word.banglaMeaning}
              </p>
            </div>

            <div className="flex flex-col gap-1.5 shrink-0">
              <button
                onClick={handleListen}
                className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center active:scale-90 transition-all"
                aria-label="Listen"
              >
                <Volume2 className="h-4 w-4" />
              </button>
              <button
                onClick={handleBookmark}
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center active:scale-90 transition-all',
                  isBookmarked
                    ? 'gradient-bg text-white shadow-md shadow-primary/30'
                    : 'bg-muted text-foreground'
                )}
                aria-label="Bookmark"
              >
                <Bookmark
                  className={cn('h-4 w-4', isBookmarked && 'fill-current')}
                />
              </button>
            </div>
          </div>

          {/* Peek preview */}
            <div
              className={cn(
                'overflow-hidden transition-[max-height,opacity] duration-200 ease-out',
                expanded
                  ? 'max-h-0 opacity-0'
                  : 'max-h-10 opacity-75 mt-2.5 pt-2.5 border-t border-dashed border-border'
              )}
            >
            <p className="text-[11px] italic text-muted-foreground truncate">
              "{word.sentence}"
            </p>
          </div>

          {/* Expanded content */}
            <div
              className={cn(
                'overflow-hidden transition-[max-height,opacity] duration-300 ease-out',
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
            className="absolute top-[calc(100%+6px)] right-3 z-30 px-3 py-2 rounded-lg text-[11px] font-semibold text-white shadow-xl whitespace-nowrap animate-bounce-hint gpu-accelerate"
            style={{ background: '#0F172A', transform: 'translateZ(0)' }}
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

  // ============================================================
  // DESKTOP VERSION (old grid card with modal)
  // ============================================================
  return (
    <div
      className={cn(
        'group relative rounded-xl border border-border bg-card p-4',
        'transition-all duration-200 hover:shadow-lg hover:border-primary/40 hover:-translate-y-0.5 cursor-pointer'
      )}
      onClick={() => onClick?.(word)}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-lg font-bold tracking-tight">{word.word}</h3>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground font-semibold">
            Word Smart {word.book}
          </span>
        </div>
        <button
          onClick={handleListen}
          className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center shrink-0 -mt-1 -mr-1 transition-colors"
          aria-label="Listen"
        >
          <Volume2 className="h-4 w-4" />
        </button>
      </div>

      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-semibold inline-block mb-2">
        Lesson {word.lesson}
      </span>

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
        <button
          onClick={handleBookmark}
          className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
          aria-label="Bookmark"
        >
          <Bookmark
            className={cn(
              'h-4 w-4 transition-all',
              isBookmarked && 'fill-primary text-primary'
            )}
          />
        </button>
      </div>
    </div>
  );
}