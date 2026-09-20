import { useState, useEffect, useMemo } from 'react';
import { useAnalogyQuestions } from '@/hooks/useAnalogyQuestions';
import { useAnalogyProgress } from '@/hooks/useAnalogyProgress';
import { AnalogyCard } from '@/components/analogy/AnalogyCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  Search,
  X,
  ArrowUp,
  RotateCcw,
  CheckCircle2,
  XCircle,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCoachMark } from '@/hooks/useCoachMark';

import { LoadingScreen } from '@/components/LoadingScreen';

const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const PAGE_SIZE = 20;

export default function AnalogyPage() {
  const {
    questions,
    loading,
    searchQuery,
    setSearchQuery,
    totalCount,
    filteredCount,
  } = useAnalogyQuestions();

  const { getStatus, correctCount, wrongCount, resetProgress } =
    useAnalogyProgress();

  const { shouldShowCoachMark, dismissCoachMark } = useCoachMark(
    'wordSmart_analogyCoachMarkSeen'
  );

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showTopButton, setShowTopButton] = useState(false);
  const [letterFilter, setLetterFilter] = useState<string | null>(null);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, letterFilter]);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filtered = useMemo(() => {
    if (!letterFilter) return questions;
    return questions.filter((q) =>
      q.question.toUpperCase().startsWith(letterFilter)
    );
  }, [questions, letterFilter]);

  const visibleQuestions = filtered.slice(0, visibleCount);

  const hasWordsForLetter = (letter: string) =>
    questions.some((q) => q.question.toUpperCase().startsWith(letter));

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <LoadingScreen fullScreen={false} message="Loading analogy questions..." />;
  }

  const progressPercent =
    correctCount + wrongCount > 0
      ? Math.round(
          (correctCount / (correctCount + wrongCount)) * 100
        )
      : 0;

  return (
    <div className="space-y-5 md:space-y-6">
      {/* ============ HEADER ============ */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
              Analogy Questions
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              {filteredCount} questions
              {letterFilter && (
                <span className="text-primary">
                  {' '}
                  · starting with "{letterFilter}"
                </span>
              )}
            </p>
          </div>

          {/* Reset button */}
          {(correctCount > 0 || wrongCount > 0) && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl h-8 gap-1.5 text-xs"
              onClick={resetProgress}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          )}
        </div>

        {/* Stats cards (if progress exists) */}
        {(correctCount > 0 || wrongCount > 0) && (
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            <div className="rounded-xl border border-border/60 bg-card p-2.5 md:p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Solved
                </span>
              </div>
              <p className="text-lg md:text-xl font-bold text-emerald-500">
                {correctCount}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card p-2.5 md:p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <XCircle className="h-3.5 w-3.5 text-red-500" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Wrong
                </span>
              </div>
              <p className="text-lg md:text-xl font-bold text-red-500">
                {wrongCount}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card p-2.5 md:p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Accuracy
                </span>
              </div>
              <p className="text-lg md:text-xl font-bold gradient-text">
                {progressPercent}%
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ============ SEARCH + ALPHABET ============ */}
      <div className="sticky top-0 md:top-0 z-30 -mx-4 px-4 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8 py-3 bg-background/95 backdrop-blur-md border-b border-border/40 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search questions, options, explanations..."
            className="pl-9 pr-9 h-11 rounded-xl bg-muted/50 border-border/60"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/30 transition-colors"
              aria-label="Clear"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Alphabet pills */}
        <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
          <button
            onClick={() => setLetterFilter(null)}
            className={cn(
              'px-3 h-8 rounded-full text-xs font-bold shrink-0 transition-all',
              !letterFilter
                ? 'gradient-bg text-white shadow-md shadow-primary/30'
                : 'bg-muted text-muted-foreground hover:bg-muted/70'
            )}
          >
            All
          </button>
          {ALPHABETS.map((letter) => {
            const has = hasWordsForLetter(letter);
            const active = letterFilter === letter;

            return (
              <button
                key={letter}
                onClick={() =>
                  has && setLetterFilter(active ? null : letter)
                }
                disabled={!has}
                className={cn(
                  'w-8 h-8 rounded-full text-xs font-bold shrink-0 transition-all',
                  active
                    ? 'gradient-bg text-white scale-110 shadow-md shadow-primary/30'
                    : has
                      ? 'bg-muted text-muted-foreground hover:bg-muted/70'
                      : 'bg-muted/30 text-muted-foreground/30 cursor-not-allowed'
                )}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      {/* ============ QUESTIONS ============ */}
      {visibleQuestions.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            No questions found matching your criteria.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop: 2 columns | Mobile: 1 column */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {visibleQuestions.map((q, idx) => (
              <AnalogyCard
                key={q.sl}
                question={q}
                status={getStatus(q.sl)}
                showCoachMark={shouldShowCoachMark && idx === 0}
                onCoachDismiss={dismissCoachMark}
              />
            ))}
          </div>

          {/* Load More */}
          {visibleCount < filtered.length && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                onClick={() =>
                  setVisibleCount((prev) =>
                    Math.min(prev + PAGE_SIZE, filtered.length)
                  )
                }
                className="w-full max-w-xs rounded-xl h-11"
              >
                Load More ({filtered.length - visibleCount} remaining)
              </Button>
            </div>
          )}
        </>
      )}

      {/* ============ BACK TO TOP ============ */}
      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 w-11 h-11 md:w-12 md:h-12 rounded-full gradient-bg text-white shadow-lg shadow-primary/30 hover:scale-110 transition-all flex items-center justify-center"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}