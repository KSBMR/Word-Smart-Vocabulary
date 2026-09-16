import { useState } from 'react';
import { Vocabulary } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle, XCircle, Volume2, Lightbulb, ChevronRight, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSpeech } from '@/hooks/useSpeech';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModal } from '@/store/authModalStore';

interface AnalogyQuestionProps {
  question: {
    word1: Vocabulary;
    meaning1: string;
    word2: Vocabulary;
    options: string[];
    correctMeaning: string;
    index: number;
  };
  selectedAnswer: string | null;
  onAnswer: (option: string) => void;
  onNext: () => void;
  isLast: boolean;
  totalQuestions: number;
}

export function AnalogyQuestion({
  question,
  selectedAnswer,
  onAnswer,
  onNext,
  isLast,
  totalQuestions,
}: AnalogyQuestionProps) {
  const speak = useSpeech();
  const [showHint, setShowHint] = useState(false);
  const { isAuthenticated } = useAuth();
  const { openModal } = useAuthModal();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const isCorrect = selectedAnswer === question.correctMeaning;
  const showFeedback = selectedAnswer !== null;
  const bookmarked = isBookmarked(question.word2.id);

  const handleBookmark = () => {
    if (!isAuthenticated) {
      openModal('login');
      return;
    }
    toggleBookmark(question.word2.id);
  };

  const getHint = () => {
    const meaning = question.correctMeaning;
    return `Starts with "${meaning.charAt(0).toUpperCase()}" and has ${meaning.length} letters.`;
  };

  return (
    <Card className="max-w-2xl mx-auto border-border shadow-lg">
      <CardHeader className="pb-4">
        {/* Progress bar */}
        <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
          <span>
            Question {question.index + 1} of {totalQuestions}
          </span>
          <span>{Math.round(((question.index + 1) / totalQuestions) * 100)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5 mb-4">
          <div
            className="gradient-bg h-1.5 rounded-full transition-all"
            style={{
              width: `${((question.index + 1) / totalQuestions) * 100}%`,
            }}
          />
        </div>

        <div className="flex justify-center mb-3">
          <div className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
            Analogy
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Analogy Expression */}
        <div className="bg-muted/40 rounded-2xl p-6 border border-border">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="text-xl font-bold text-primary">
                {question.word1.word}
              </span>
              <span className="text-muted-foreground">:</span>
              <span className="text-base text-muted-foreground italic">
                {question.meaning1}
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
              <span className="h-px w-8 bg-border"></span>
              <span>as</span>
              <span className="h-px w-8 bg-border"></span>
            </div>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="text-xl font-bold text-primary">
                {question.word2.word}
              </span>
              <span className="text-muted-foreground">:</span>
              <span className="text-base text-muted-foreground italic">?</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={() => speak(question.word2.word)}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn('h-8 w-8 rounded-lg', bookmarked && 'text-primary')}
                onClick={handleBookmark}
                title={bookmarked ? 'Remove bookmark' : 'Bookmark this word'}
              >
                <Bookmark
                  className={cn('h-4 w-4', bookmarked && 'fill-primary')}
                />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {question.word2.pronunciation}
            </p>
          </div>
        </div>

        {/* Hint */}
        {!showFeedback && (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-muted-foreground rounded-lg"
              onClick={() => setShowHint(!showHint)}
            >
              <Lightbulb className="h-3.5 w-3.5" />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </Button>
          </div>
        )}
        {showHint && !showFeedback && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-sm">
            <span className="font-semibold">Hint:</span> {getHint()}
          </div>
        )}

        {/* Options */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">
            Choose the best answer:
          </p>
          <RadioGroup
            value={selectedAnswer || ''}
            onValueChange={(value) => onAnswer(value)}
            disabled={showFeedback}
            className="space-y-2"
          >
            {question.options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isCorrectOption = option === question.correctMeaning;
              return (
                <div
                  key={idx}
                  className={cn(
                    'flex items-center space-x-3 p-3.5 rounded-xl border-2 transition-all',
                    showFeedback &&
                      isCorrectOption &&
                      'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30',
                    showFeedback &&
                      isSelected &&
                      !isCorrect &&
                      'border-red-500 bg-red-50 dark:bg-red-950/30',
                    !showFeedback &&
                      'border-border hover:border-primary/50 hover:bg-muted/40 cursor-pointer'
                  )}
                >
                  <RadioGroupItem value={option} id={`option-${idx}`} />
                  <label
                    htmlFor={`option-${idx}`}
                    className="flex-1 cursor-pointer text-sm"
                  >
                    {option}
                  </label>
                  {showFeedback && isCorrectOption && (
                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                  )}
                  {showFeedback && isSelected && !isCorrect && (
                    <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                  )}
                </div>
              );
            })}
          </RadioGroup>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className="p-4 bg-muted/50 rounded-xl space-y-2 text-sm border border-border">
            <div>
              <span className="font-semibold">Meaning of {question.word2.word}:</span>{' '}
              {question.word2.englishMeaning}
            </div>
            <div>
              <span className="font-semibold">Bangla:</span>{' '}
              {question.word2.banglaMeaning}
            </div>
            <div>
              <span className="font-semibold">Example:</span>{' '}
              <span className="italic">"{question.word2.sentence}"</span>
            </div>
            {!isCorrect && (
              <div className="text-red-500 font-medium pt-1 border-t border-border/60">
                Correct answer: {question.correctMeaning}
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t border-border/60 pt-4">
        <span className="text-sm font-medium">
          {selectedAnswer !== null ? (
            isCorrect ? (
              <span className="text-emerald-500">✅ Correct!</span>
            ) : (
              <span className="text-red-500">❌ Incorrect</span>
            )
          ) : (
            <span className="text-muted-foreground">Select an option</span>
          )}
        </span>
        <Button
          onClick={onNext}
          disabled={selectedAnswer === null}
          className="rounded-xl gradient-bg hover:opacity-90 text-white px-6 gap-1"
        >
          {isLast ? 'Finish' : 'Next'}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}