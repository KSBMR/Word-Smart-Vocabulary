import { Vocabulary } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle, XCircle, Volume2, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSpeech } from '@/hooks/useSpeech';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModal } from '@/store/authModalStore';

interface QuizQuestionProps {
  question: {
    word: Vocabulary;
    options: string[];
    correctAnswer: string;
    index: number;
  };
  selectedAnswer: string | null;
  onAnswer: (option: string) => void;
  onNext: () => void;
  isLast: boolean;
  totalQuestions: number;
}

export function QuizQuestion({
  question,
  selectedAnswer,
  onAnswer,
  onNext,
  isLast,
  totalQuestions,
}: QuizQuestionProps) {
  const speak = useSpeech();
  const { isAuthenticated } = useAuth();
  const { openModal } = useAuthModal();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const isCorrect = selectedAnswer === question.correctAnswer;
  const showFeedback = selectedAnswer !== null;
  const pronunciation = question.word.pronunciation || question.word.word;
  const bookmarked = isBookmarked(question.word.id);

  const handleBookmark = () => {
    if (!isAuthenticated) {
      openModal('login');
      return;
    }
    toggleBookmark(question.word.id);
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

        {/* Question */}
        <CardTitle className="text-xl md:text-2xl text-center leading-relaxed">
          What is the meaning of{' '}
          <span className="gradient-text font-bold">{question.word.word}</span>?
        </CardTitle>

        {/* Pronunciation + Actions */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
          <span className="font-mono">{pronunciation}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg"
            onClick={() => speak(question.word.word)}
          >
            <Volume2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'h-7 w-7 rounded-lg',
              bookmarked && 'text-primary'
            )}
            onClick={handleBookmark}
            title={bookmarked ? 'Remove bookmark' : 'Bookmark this word'}
          >
            <Bookmark
              className={cn('h-4 w-4', bookmarked && 'fill-primary')}
            />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <RadioGroup
          value={selectedAnswer || ''}
          onValueChange={(value) => onAnswer(value)}
          disabled={showFeedback}
          className="space-y-2"
        >
          {question.options.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === question.correctAnswer;
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

        {showFeedback && (
          <div className="mt-4 p-4 bg-muted/50 rounded-xl space-y-2 text-sm border border-border">
            <div>
              <span className="font-semibold">Bangla:</span>{' '}
              {question.word.banglaMeaning}
            </div>
            <div>
              <span className="font-semibold">Example:</span>{' '}
              <span className="italic">"{question.word.sentence}"</span>
            </div>
            {!isCorrect && (
              <div className="text-red-500 font-medium pt-1 border-t border-border/60">
                Correct answer: {question.correctAnswer}
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
          className="rounded-xl gradient-bg hover:opacity-90 text-white px-6"
        >
          {isLast ? 'Finish' : 'Next →'}
        </Button>
      </CardFooter>
    </Card>
  );
}