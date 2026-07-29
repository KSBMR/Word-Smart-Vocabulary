import { useState } from 'react';
import { Vocabulary } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle, XCircle, Volume2, Lightbulb, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSpeech } from '@/hooks/useSpeech';

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

  // ✅ IMPORTANT: Define showFeedback here
  const showFeedback = selectedAnswer !== null;
  const isCorrect = selectedAnswer === question.correctMeaning;

  const handleSpeak = (word: string) => {
    speak(word);
  };

  const getHint = () => {
    const meaning = question.correctMeaning;
    const firstLetter = meaning.charAt(0).toUpperCase();
    const length = meaning.length;
    return `Starts with "${firstLetter}" and has ${length} letters.`;
  };

  return (
    <Card className="max-w-2xl mx-auto border-2 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Question {question.index + 1} of {totalQuestions}</span>
          <span>{Math.round(((question.index + 1) / totalQuestions) * 100)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5">
          <div
            className="bg-primary h-1.5 rounded-full transition-all"
            style={{ width: `${((question.index + 1) / totalQuestions) * 100}%` }}
          />
        </div>
        <div className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full inline-block mt-2">
          Definition
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Analogy Expression */}
        <div className="bg-gradient-to-br from-muted/50 to-muted/20 rounded-xl p-6 border border-border/50">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="text-xl font-bold text-primary">{question.word1.word}</span>
              <span className="text-muted-foreground text-xl">:</span>
              <span className="text-base text-muted-foreground italic">{question.meaning1}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
              <span className="h-px w-8 bg-muted-foreground/30"></span>
              <span>as</span>
              <span className="h-px w-8 bg-muted-foreground/30"></span>
            </div>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="text-xl font-bold text-primary">{question.word2.word}</span>
              <span className="text-muted-foreground text-xl">:</span>
              <span className="text-base text-muted-foreground italic">?</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleSpeak(question.word2.word)}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{question.word2.pronunciation}</p>
          </div>
        </div>

        {/* Hint Section */}
        {!showFeedback && (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground text-xs"
              onClick={() => setShowHint(!showHint)}
            >
              <Lightbulb className="h-3 w-3" />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </Button>
          </div>
        )}
        {showHint && !showFeedback && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm">
            <span className="font-medium">Hint:</span> {getHint()}
          </div>
        )}

        {/* Options */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Choose the best answer:</p>
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
                    'flex items-center space-x-3 p-3 rounded-lg border transition-all',
                    showFeedback && isCorrectOption && 'border-green-500 bg-green-50 dark:bg-green-950/30 shadow-sm',
                    showFeedback && isSelected && !isCorrect && 'border-red-500 bg-red-50 dark:bg-red-950/30 shadow-sm',
                    !showFeedback && 'hover:border-primary/30 hover:bg-muted/30 cursor-pointer'
                  )}
                >
                  <RadioGroupItem value={option} id={`option-${idx}`} />
                  <label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer text-sm">
                    {option}
                  </label>
                  {showFeedback && isCorrectOption && <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />}
                  {showFeedback && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-500 shrink-0" />}
                </div>
              );
            })}
          </RadioGroup>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className="p-4 bg-muted/50 rounded-lg space-y-2 text-sm border border-border/50">
            <div className="flex items-start gap-2">
              <span className="font-medium text-primary">Meaning of {question.word2.word}:</span>
              <span>{question.word2.englishMeaning}</span>
            </div>
            <div>
              <span className="font-medium">Bangla:</span> {question.word2.banglaMeaning}
            </div>
            <div>
              <span className="font-medium">Example:</span>{' '}
              <span className="italic">"{question.word2.sentence}"</span>
            </div>
            {!isCorrect && (
              <div className="text-red-500 font-medium mt-1">
                Correct answer: {question.correctMeaning}
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <span className="text-sm">
          {selectedAnswer !== null ? (
            isCorrect ? (
              <span className="text-green-500 font-medium">✅ Correct!</span>
            ) : (
              <span className="text-red-500 font-medium">❌ Incorrect</span>
            )
          ) : (
            <span className="text-muted-foreground">Select an option</span>
          )}
        </span>
        <Button onClick={onNext} disabled={selectedAnswer === null} className="gap-1">
          {isLast ? 'Finish' : 'Next'}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}