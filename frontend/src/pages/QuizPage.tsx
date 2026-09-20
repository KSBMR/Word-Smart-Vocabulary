import { useState, useEffect } from 'react';
import { useVocabulary } from '@/hooks/useVocabulary';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useQuiz } from '@/hooks/useQuiz';
import { useAnalogyFileQuiz } from '@/hooks/useAnalogyFileQuiz';
import { useAnalogyProgress } from '@/hooks/useAnalogyProgress';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { loadAnalogyQuestions } from '@/services/AnalogyService';
import { QuizQuestion } from '@/components/quiz/QuizQuestion';
import { AnalogyFileQuestion } from '@/components/quiz/AnalogyFileQuestion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Bookmark, Shuffle, Brain, Link2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Vocabulary, AnalogyQuestion } from '@/types';

type QuizMode = 'meaning' | 'analogy';
type QuizSource = 'random' | 'bookmarked';

const QUESTION_COUNTS = [5, 10, 20, 50];

export default function QuizPage() {
  const { words, loading: vocabLoading } = useVocabulary();
  const { bookmarks } = useBookmarks();
  const { markCorrect, markWrong } = useAnalogyProgress();

  const [mode, setMode] = useState<QuizMode>('meaning');
  const [source, setSource] = useState<QuizSource>('random');
  const [numQuestions, setNumQuestions] = useState(10);
  const [quizStarted, setQuizStarted] = useState(false);

  // Analogy pool
  const [analogyPool, setAnalogyPool] = useState<AnalogyQuestion[]>([]);
  const [analogyLoading, setAnalogyLoading] = useState(true);

  useEffect(() => {
    loadAnalogyQuestions().then((data) => {
      setAnalogyPool(data);
      setAnalogyLoading(false);
    });
  }, []);

  // Word list for meaning mode
  const getWordList = (): Vocabulary[] => {
    if (source === 'bookmarked') {
      return words.filter((w) => bookmarks.includes(w.id));
    }
    return words;
  };

  const wordList = getWordList();

  const meaningQuiz = useQuiz(wordList);
  const analogyQuiz = useAnalogyFileQuiz(analogyPool);

  const activeQuiz = mode === 'meaning' ? meaningQuiz : analogyQuiz;
  const {
    currentQuestion,
    selectedAnswer,
    totalQuestions,
    score,
    isFinished,
    generateQuiz,
    answer,
    next,
    restart,
  } = activeQuiz;

  // Wrap answer to track progress for analogy mode
  const handleAnswer = (key: string) => {
    if (mode === 'analogy') {
      const q = (currentQuestion as any)?.question as AnalogyQuestion;
      if (q && !selectedAnswer) {
        if (key === q.answer) markCorrect(q.sl);
        else markWrong(q.sl);
      }
    }
    answer(key);
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    enabled: quizStarted && !isFinished,
    onOption: handleAnswer,
    onNext: () => {
      if (selectedAnswer !== null) next();
    },
  });

  const startQuiz = () => {
    if (mode === 'meaning') {
      if (wordList.length === 0) {
        alert(
          source === 'bookmarked'
            ? 'You have no bookmarked words yet.'
            : 'No words available.'
        );
        return;
      }
    } else {
      if (analogyPool.length === 0) {
        alert('No analogy questions available.');
        return;
      }
    }
    generateQuiz(numQuestions);
    setQuizStarted(true);
  };

  const loading = vocabLoading || analogyLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // ==================== SELECTION ====================
  if (!quizStarted) {
    return (
      <div className="space-y-4 md:space-y-6 max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
          Quiz
        </h2>

        {/* Mode */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">
              Select Quiz Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant={mode === 'meaning' ? 'default' : 'outline'}
                onClick={() => setMode('meaning')}
                className={cn(
                  'flex-1 gap-2',
                  mode === 'meaning' && 'gradient-bg border-0'
                )}
              >
                <Brain className="h-4 w-4" /> Word → Meaning
              </Button>
              <Button
                variant={mode === 'analogy' ? 'default' : 'outline'}
                onClick={() => setMode('analogy')}
                className={cn(
                  'flex-1 gap-2',
                  mode === 'analogy' && 'gradient-bg border-0'
                )}
              >
                <Link2 className="h-4 w-4" /> Analogy
              </Button>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">
              {mode === 'meaning'
                ? 'See a word, choose its correct meaning.'
                : 'See an analogy (A : B :: C : ?), choose the correct pair.'}
            </p>
          </CardContent>
        </Card>

        {/* Source (meaning only) */}
        {mode === 'meaning' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">
                Word Source
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant={source === 'random' ? 'default' : 'outline'}
                  onClick={() => setSource('random')}
                  className={cn(
                    'flex-1 gap-2',
                    source === 'random' && 'gradient-bg border-0'
                  )}
                >
                  <Shuffle className="h-4 w-4" /> Random
                </Button>
                <Button
                  variant={source === 'bookmarked' ? 'default' : 'outline'}
                  onClick={() => setSource('bookmarked')}
                  className={cn(
                    'flex-1 gap-2',
                    source === 'bookmarked' && 'gradient-bg border-0'
                  )}
                  disabled={bookmarks.length === 0}
                >
                  <Bookmark className="h-4 w-4" /> Bookmarked (
                  {bookmarks.length})
                </Button>
              </div>
              {source === 'bookmarked' && bookmarks.length === 0 && (
                <p className="text-xs text-amber-500 dark:text-amber-400">
                  No bookmarks yet. Save some words first.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Question count */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">
              Number of Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {QUESTION_COUNTS.map((n) => (
                <button
                  key={n}
                  onClick={() => setNumQuestions(n)}
                  className={cn(
                    'py-2.5 rounded-xl text-sm font-bold border-2 transition-all',
                    numQuestions === n
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/40'
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={startQuiz}
          disabled={
            mode === 'meaning'
              ? wordList.length === 0
              : analogyPool.length === 0
          }
          className="w-full gradient-bg border-0 h-11 md:h-12 rounded-xl text-base"
        >
          Start Quiz ({numQuestions} questions)
        </Button>
      </div>
    );
  }

  // ==================== FINISHED ====================
  if (isFinished) {
    const percentage = Math.round((score / totalQuestions) * 100);
    let message = '';
    if (percentage === 100) message = "🌟 Perfect! You're a master!";
    else if (percentage >= 70) message = '👏 Great job! Keep practicing.';
    else if (percentage >= 50) message = '💪 Good effort! Review misses.';
    else message = "📖 Keep studying! You'll improve.";

    return (
      <div className="space-y-4 md:space-y-6 max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Quiz Complete!
        </h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl text-center">
              {score} / {totalQuestions}
            </CardTitle>
            <p className="text-center text-sm md:text-base text-muted-foreground">
              {message}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="w-full bg-muted rounded-full h-2.5">
              <div
                className="gradient-bg h-2.5 rounded-full transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => {
                  setQuizStarted(false);
                  restart();
                }}
                variant="outline"
                className="flex-1 rounded-xl gap-2"
              >
                <RotateCcw className="h-4 w-4" /> New Quiz
              </Button>
              <Button
                onClick={restart}
                className="flex-1 rounded-xl gradient-bg border-0"
              >
                Retry Same
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ==================== ACTIVE ====================
  return (
    <div className="space-y-4 md:space-y-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Quiz
        </h2>
        <span className="text-xs md:text-sm text-muted-foreground">
          {mode === 'meaning' ? 'Word → Meaning' : 'Analogy'}
        </span>
      </div>

      {mode === 'meaning' && currentQuestion && (
        <QuizQuestion
          question={currentQuestion as any}
          selectedAnswer={selectedAnswer}
          onAnswer={handleAnswer}
          onNext={next}
          isLast={
            (currentQuestion as any).index === totalQuestions - 1
          }
          totalQuestions={totalQuestions}
        />
      )}

      {mode === 'analogy' && currentQuestion && (
        <AnalogyFileQuestion
          question={(currentQuestion as any).question}
          questionIndex={(currentQuestion as any).index}
          totalQuestions={totalQuestions}
          selectedAnswer={selectedAnswer}
          onAnswer={handleAnswer}
          onNext={next}
          isLast={(currentQuestion as any).index === totalQuestions - 1}
        />
      )}

      {/* Keyboard hint (desktop only) */}
      {mode === 'analogy' && (
        <p className="hidden md:block text-center text-xs text-muted-foreground">
          ⌨️ Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px]">A</kbd>–
          <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px]">E</kbd> to answer,{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px]">Enter</kbd> for next
        </p>
      )}
    </div>
  );
}