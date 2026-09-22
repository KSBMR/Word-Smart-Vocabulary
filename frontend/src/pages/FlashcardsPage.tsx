import { useState, useMemo, useEffect } from 'react';
import { useVocabulary } from '@/hooks/useVocabulary';
import { loadAnalogyQuestions } from '@/services/AnalogyService';
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';
import { WordFlashCard } from '@/components/flashcard/FlashCard';
import { AnalogyFlashCard } from '@/components/flashcard/AnalogyFlashCard';
import { RequireAuthOverlay } from '@/components/RequireAuthOverlay';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnalogyQuestion } from '@/types';

type Mode = 'word' | 'analogy';

export default function FlashcardsPage() {
  const { words, loading: vocabLoading } = useVocabulary();
  const { review } = useSpacedRepetition();

  const [mode, setMode] = useState<Mode>('word');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [analogyPool, setAnalogyPool] = useState<AnalogyQuestion[]>([]);
  const [analogyLoading, setAnalogyLoading] = useState(true);
  const [sessionStats, setSessionStats] = useState({ easy: 0, hard: 0, again: 0 });

  useEffect(() => {
    loadAnalogyQuestions().then((data) => {
      setAnalogyPool(data);
      setAnalogyLoading(false);
    });
  }, []);

  const deck = useMemo(() => {
    if (mode === 'word') {
      return words.slice(0, 20).map((w) => ({
        type: 'word' as const,
        data: {
          id: w.id,
          word: w.word,
          pronunciation: w.pronunciation,
          englishMeaning: w.englishMeaning,
          banglaMeaning: w.banglaMeaning,
          sentence: w.sentence,
          book: w.book,
          lesson: w.lesson,
        },
      }));
    }
    return analogyPool.slice(0, 20).map((a) => ({
      type: 'analogy' as const,
      data: a,
    }));
  }, [mode, words, analogyPool]);

  useEffect(() => {
    setCurrentIndex(0);
    setFlipped(false);
  }, [mode]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === 'ArrowRight') nextCard();
      else if (e.key === 'ArrowLeft') prevCard();
      else if (e.key === '1' && flipped) handleRate('again');
      else if (e.key === '2' && flipped) handleRate('hard');
      else if (e.key === '3' && flipped) handleRate('easy');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipped, currentIndex, deck.length]);

  const currentCard = deck[currentIndex];
  const handleFlip = () => setFlipped((f) => !f);

  const nextCard = () => {
    if (currentIndex < deck.length - 1) {
      setCurrentIndex((i) => i + 1);
      setFlipped(false);
    } else {
      const total = deck.length;
      alert(
        `🎉 Session Complete!\n\nEasy: ${sessionStats.easy}\nHard: ${sessionStats.hard}\nAgain: ${sessionStats.again}\n\n${total} cards reviewed`
      );
      setCurrentIndex(0);
      setFlipped(false);
      setSessionStats({ easy: 0, hard: 0, again: 0 });
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setFlipped(false);
    }
  };

  const handleRate = (rating: 'again' | 'hard' | 'easy') => {
    if (!currentCard) return;
    const cardId =
      currentCard.type === 'word'
        ? currentCard.data.id
        : (currentCard.data as AnalogyQuestion).sl;
    review(currentCard.type, cardId as number, rating);
    setSessionStats((s) => ({ ...s, [rating]: s[rating] + 1 }));
    setTimeout(nextCard, 250);
  };

  const progressPercent = deck.length ? ((currentIndex + 1) / deck.length) * 100 : 0;
  const loading = vocabLoading || analogyLoading;

  return (
    <RequireAuthOverlay featureName="Flashcards">
      <div className="space-y-4 max-w-3xl mx-auto animate-page-fade">
        {/* Header: Mode + Progress */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Flashcards
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              {deck.length} cards · {mode === 'word' ? 'Word mode' : 'Analogy mode'}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center gap-0.5 p-1 rounded-xl bg-muted/60">
            <button
              onClick={() => setMode('word')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                mode === 'word'
                  ? 'gradient-bg text-white shadow-sm shadow-primary/30'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              🎴 Word
            </button>
            <button
              onClick={() => setMode('analogy')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                mode === 'analogy'
                  ? 'gradient-bg text-white shadow-sm shadow-primary/30'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              🔗 Analogy
            </button>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
            <span>
              {deck.length > 0 ? currentIndex + 1 : 0} / {deck.length}
            </span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full gradient-bg transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Card Area */}
        {loading ? (
          <LoadingScreen fullScreen={false} message="Loading cards..." />
        ) : !currentCard ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🎉</div>
            <p className="font-semibold">No cards available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* The Card */}
            <div className="h-[420px] md:h-[480px]">
              {currentCard.type === 'word' ? (
                <WordFlashCard
                  data={currentCard.data as any}
                  flipped={flipped}
                  onFlip={handleFlip}
                />
              ) : (
                <AnalogyFlashCard
                  data={currentCard.data as any}
                  flipped={flipped}
                  onFlip={handleFlip}
                />
              )}
            </div>

            {/* Rating Buttons */}
            <div
              className={cn(
                'transition-all duration-300',
                flipped
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4 pointer-events-none'
              )}
            >
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleRate('again')}
                  className="py-3 rounded-xl border-2 border-red-500/50 text-red-500 font-bold text-xs hover:bg-red-500/10 active:scale-95 transition-all flex flex-col items-center gap-0.5"
                >
                  <span className="text-lg">😰</span>
                  Again
                </button>
                <button
                  onClick={() => handleRate('hard')}
                  className="py-3 rounded-xl border-2 border-amber-500/50 text-amber-500 font-bold text-xs hover:bg-amber-500/10 active:scale-95 transition-all flex flex-col items-center gap-0.5"
                >
                  <span className="text-lg">🤔</span>
                  Hard
                </button>
                <button
                  onClick={() => handleRate('easy')}
                  className="py-3 rounded-xl border-2 border-emerald-500/50 text-emerald-500 font-bold text-xs hover:bg-emerald-500/10 active:scale-95 transition-all flex flex-col items-center gap-0.5"
                >
                  <span className="text-lg">😎</span>
                  Easy
                </button>
              </div>
            </div>

            {/* Nav */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={prevCard}
                disabled={currentIndex === 0}
                className="rounded-xl h-11 gap-1.5"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                onClick={nextCard}
                className="rounded-xl gradient-bg hover:opacity-90 text-white gap-1.5 h-11"
              >
                {currentIndex === deck.length - 1 ? 'Finish' : 'Next'}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Session Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded-lg bg-muted/40 text-center">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                  Easy
                </div>
                <div className="text-base font-extrabold text-emerald-500">
                  {sessionStats.easy}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-muted/40 text-center">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                  Hard
                </div>
                <div className="text-base font-extrabold text-amber-500">
                  {sessionStats.hard}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-muted/40 text-center">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                  Again
                </div>
                <div className="text-base font-extrabold text-red-500">
                  {sessionStats.again}
                </div>
              </div>
            </div>

            {/* Reset */}
            <div className="text-center pb-2">
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setFlipped(false);
                  setSessionStats({ easy: 0, hard: 0, again: 0 });
                }}
                className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                Reset session
              </button>
            </div>
          </div>
        )}
      </div>
    </RequireAuthOverlay>
  );
}