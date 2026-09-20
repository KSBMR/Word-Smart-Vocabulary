import { useMemo } from 'react';
import { AnalogyQuestion } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { cleanAnalogyItem } from '@/utils/cleanText';

interface AnalogyFileQuestionProps {
  question: AnalogyQuestion;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onAnswer: (optionKey: string) => void;
  onNext: () => void;
  isLast: boolean;
}

export function AnalogyFileQuestion({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  onAnswer,
  onNext,
  isLast,
}: AnalogyFileQuestionProps) {
  const isCorrect = selectedAnswer === question.answer;
  const showFeedback = selectedAnswer !== null;

  // ✅ Clean Bangla/Hindi from question + options (before answer)
  const cleaned = useMemo(() => cleanAnalogyItem(question), [question]);

  const optionKeys = Object.keys(question.options) as Array<
    keyof typeof question.options
  >;

  return (
    <Card className="border-border shadow-lg">
      <CardHeader className="pb-4">
        {/* Progress bar */}
        <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
          <span>
            Question {questionIndex + 1} of {totalQuestions}
          </span>
          <span>
            {Math.round(((questionIndex + 1) / totalQuestions) * 100)}%
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5 mb-4">
          <div
            className="gradient-bg h-1.5 rounded-full transition-all"
            style={{
              width: `${((questionIndex + 1) / totalQuestions) * 100}%`,
            }}
          />
        </div>

        {/* Analogy tag */}
        <div className="flex justify-center mb-3">
          <div className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
            🔗 Analogy
          </div>
        </div>

        {/* Question title — cleaned before answer, full after */}
        <div className="text-center">
          <CardTitle className="text-lg sm:text-xl md:text-2xl leading-relaxed">
            {showFeedback ? question.question : cleaned.cleanedQuestion}
          </CardTitle>

          {/* Bangla hint (only after answer) */}
          {showFeedback && cleaned.banglaQuestion && (
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-2 leading-relaxed">
              {cleaned.banglaQuestion}
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-2 sm:space-y-3">
        {optionKeys.map((key) => {
          const originalValue = question.options[key];
          const cleanedValue = cleaned.cleanedOptions[key];
          const banglaValue = cleaned.banglaOptions[key];
          const isSelected = selectedAnswer === key;
          const isCorrectOption = key === question.answer;

          return (
            <button
              key={key}
              type="button"
              disabled={showFeedback}
              onClick={() => onAnswer(key)}
              className={cn(
                'w-full flex items-start gap-3 p-3 sm:p-3.5 rounded-xl border-2 transition-all text-left',
                showFeedback &&
                  isCorrectOption &&
                  'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30',
                showFeedback &&
                  isSelected &&
                  !isCorrect &&
                  'border-red-500 bg-red-50 dark:bg-red-950/30',
                !showFeedback &&
                  'border-border hover:border-primary/50 hover:bg-muted/40 cursor-pointer active:scale-[0.99]'
              )}
            >
              {/* Option key badge */}
              <span
                className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0',
                  showFeedback && isCorrectOption
                    ? 'bg-emerald-500 text-white'
                    : showFeedback && isSelected && !isCorrect
                      ? 'bg-red-500 text-white'
                      : 'bg-muted text-foreground'
                )}
              >
                {key}
              </span>

              {/* Option text */}
              <div className="flex-1 min-w-0 pt-0.5">
                <p
                  className={cn(
                    'text-[13px] sm:text-sm leading-snug',
                    showFeedback && isCorrectOption && 'font-semibold'
                  )}
                >
                  {showFeedback ? originalValue : cleanedValue}
                </p>

                {/* Bangla hint (only after answer) */}
                {showFeedback && banglaValue && (
                  <p
                    className={cn(
                      'text-[11px] mt-1 leading-snug',
                      isCorrectOption
                        ? 'text-emerald-600/80 dark:text-emerald-400/80'
                        : isSelected && !isCorrect
                          ? 'text-red-600/80 dark:text-red-400/80'
                          : 'text-muted-foreground'
                    )}
                  >
                    {banglaValue}
                  </p>
                )}
              </div>

              {/* Icons */}
              {showFeedback && isCorrectOption && (
                <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
              )}
              {showFeedback && isSelected && !isCorrect && (
                <XCircle className="h-5 w-5 text-red-500 shrink-0" />
              )}
            </button>
          );
        })}

        {/* Feedback box */}
        {showFeedback && (
          <div className="mt-4 p-3 sm:p-4 bg-muted/50 rounded-xl space-y-2 text-xs sm:text-sm border border-border">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Correct Answer:</span>
              <span className="font-bold text-primary">{question.answer}</span>
            </div>
            <div className="pt-2 border-t border-border/60">
              <span className="font-semibold">✨ Explanation:</span>{' '}
              <span className="text-foreground/90">
                {question.explanation}
              </span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t border-border/60 pt-4 gap-2 flex-wrap">
        <span className="text-xs sm:text-sm font-medium">
          {selectedAnswer !== null ? (
            isCorrect ? (
              <span className="text-emerald-500">✅ Correct!</span>
            ) : (
              <span className="text-red-500">❌ Incorrect</span>
            )
          ) : (
            <span className="text-muted-foreground">
              Select an option (A–E)
            </span>
          )}
        </span>
        <Button
          onClick={onNext}
          disabled={selectedAnswer === null}
          className="rounded-xl gradient-bg hover:opacity-90 text-white px-4 sm:px-6 gap-1"
        >
          {isLast ? 'Finish' : 'Next'}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}