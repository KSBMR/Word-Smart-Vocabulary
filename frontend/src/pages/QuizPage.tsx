import { useState } from 'react';
import { useVocabulary } from '@/hooks/useVocabulary';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useQuiz } from '@/hooks/useQuiz';
import { useAnalogyQuiz } from '@/hooks/useAnalogyQuiz';
import { QuizQuestion } from '@/components/quiz/QuizQuestion';
import { AnalogyQuestion } from '@/components/quiz/AnalogyQuestion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Bookmark, Shuffle, Brain } from 'lucide-react';
import { Vocabulary } from '@/types';

type QuizMode = 'meaning' | 'analogy';
type QuizSource = 'random' | 'bookmarked';

export default function QuizPage() {
  const { words, loading } = useVocabulary();
  const { bookmarks } = useBookmarks();
  const [mode, setMode] = useState<QuizMode>('meaning');
  const [source, setSource] = useState<QuizSource>('random');
  const [quizStarted, setQuizStarted] = useState(false);

  // Get word list based on source
  const getWordList = (): Vocabulary[] => {
    if (source === 'bookmarked') {
      return words.filter(w => bookmarks.includes(w.id));
    }
    return words;
  };

  const wordList = getWordList();

  // Initialize both quiz hooks
  const meaningQuiz = useQuiz(wordList);
  const analogyQuiz = useAnalogyQuiz(wordList);

  // Choose the active quiz based on mode
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

  const startQuiz = () => {
    if (wordList.length === 0) {
      alert(
        source === 'bookmarked'
          ? 'You have no bookmarked words yet. Save some words first!'
          : 'No words available.'
      );
      return;
    }
    generateQuiz(10);
    setQuizStarted(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Quiz selection screen
  if (!quizStarted) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight">Quiz</h2>

        {/* Mode Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Quiz Mode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant={mode === 'meaning' ? 'default' : 'outline'}
                onClick={() => setMode('meaning')}
                className="flex-1 gap-2"
              >
                <Brain className="h-4 w-4" /> Word → Meaning
              </Button>
              <Button
                variant={mode === 'analogy' ? 'default' : 'outline'}
                onClick={() => setMode('analogy')}
                className="flex-1 gap-2"
              >
                <Brain className="h-4 w-4" /> Analogy
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {mode === 'meaning'
                ? 'You will see a word and choose its correct meaning.'
                : 'You will see a word:meaning pair, then a new word. Choose its meaning to complete the analogy.'}
            </p>
          </CardContent>
        </Card>

        {/* Source Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Word Source</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Choose where to pick words from.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant={source === 'random' ? 'default' : 'outline'}
                onClick={() => setSource('random')}
                className="flex-1 gap-2"
              >
                <Shuffle className="h-4 w-4" /> Random Words
              </Button>
              <Button
                variant={source === 'bookmarked' ? 'default' : 'outline'}
                onClick={() => setSource('bookmarked')}
                className="flex-1 gap-2"
                disabled={bookmarks.length === 0}
              >
                <Bookmark className="h-4 w-4" /> Bookmarked ({bookmarks.length})
              </Button>
            </div>
            {source === 'bookmarked' && bookmarks.length === 0 && (
              <p className="text-sm text-amber-500 dark:text-amber-400">
                No bookmarks yet. Go to Vocabulary and save some words.
              </p>
            )}
            <Button
              onClick={startQuiz}
              disabled={wordList.length === 0}
              className="w-full"
            >
              Start Quiz ({Math.min(10, wordList.length)} questions)
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Finished screen
  if (isFinished) {
    const percentage = Math.round((score / totalQuestions) * 100);
    let message = '';
    if (percentage === 100) message = '🌟 Perfect! You\'re a vocabulary master!';
    else if (percentage >= 70) message = '👏 Great job! Keep practicing.';
    else if (percentage >= 50) message = '💪 Good effort! Review the words you missed.';
    else message = '📖 Keep studying! You\'ll improve with practice.';

    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight">Quiz Complete!</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              {score} / {totalQuestions}
            </CardTitle>
            <p className="text-center text-muted-foreground">{message}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="w-full bg-muted rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full transition-all"
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
                className="flex-1"
              >
                New Quiz
              </Button>
              <Button onClick={restart} className="flex-1">
                Retry Same Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Active quiz
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Quiz</h2>
        <span className="text-sm text-muted-foreground">
          Question {currentQuestion ? currentQuestion.index + 1 : 0} of {totalQuestions}
        </span>
      </div>
      {currentQuestion && (
        mode === 'meaning' ? (
          <QuizQuestion
            question={currentQuestion as any} // Type assertion because TypeScript can't narrow the union
            selectedAnswer={selectedAnswer}
            onAnswer={answer}
            onNext={next}
            isLast={currentQuestion.index === totalQuestions - 1}
          />
        ) : (
          <AnalogyQuestion
            question={currentQuestion as any}
            selectedAnswer={selectedAnswer}
            onAnswer={answer}
            onNext={next}
            isLast={currentQuestion.index === totalQuestions - 1}
          />
        )
      )}
    </div>
  );
}