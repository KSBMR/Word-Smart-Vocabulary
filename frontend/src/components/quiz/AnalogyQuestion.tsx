import { Vocabulary } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle, XCircle, Volume2 } from 'lucide-react';
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
}

export function AnalogyQuestion({
  question,
  selectedAnswer,
  onAnswer,
  onNext,
  isLast,
}: AnalogyQuestionProps) {
  const speak = useSpeech();
  const isCorrect = selectedAnswer === question.correctMeaning;
  const showFeedback = selectedAnswer !== null;

  const handleSpeak = (word: string) => {
    speak(word);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl text-center">
          <span className="font-bold text-primary">{question.word1.word}</span> :{' '}
          <span className="text-muted-foreground">{question.meaning1}</span>
          <br />
          <span className="font-bold text-primary">{question.word2.word}</span> : ?
        </CardTitle>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-1">
          <span>Pronunciation: {question.word2.pronunciation}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => handleSpeak(question.word2.word)}
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
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
                  'flex items-center space-x-2 p-3 rounded-lg border transition-colors',
                  showFeedback && isCorrectOption && 'bg-green-50 border-green-500 dark:bg-green-950/30',
                  showFeedback && isSelected && !isCorrect && 'bg-red-50 border-red-500 dark:bg-red-950/30',
                  !showFeedback && 'hover:bg-muted/50'
                )}
              >
                <RadioGroupItem value={option} id={`option-${idx}`} />
                <label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer text-sm">
                  {option}
                </label>
                {showFeedback && isCorrectOption && <CheckCircle className="h-5 w-5 text-green-500" />}
                {showFeedback && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-500" />}
              </div>
            );
          })}
        </RadioGroup>

        {showFeedback && (
          <div className="mt-4 p-3 bg-muted rounded-lg space-y-2">
            <div>
              <span className="font-medium">Bangla meaning:</span>{' '}
              {question.word2.banglaMeaning}
            </div>
            <div>
              <span className="font-medium">Example:</span>{' '}
              <span className="italic">"{question.word2.sentence}"</span>
            </div>
            {!isCorrect && (
              <div className="text-sm text-red-500">
                Correct answer: <span className="font-medium">{question.correctMeaning}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="text-sm text-muted-foreground">
          {selectedAnswer !== null ? (isCorrect ? '✅ Correct!' : '❌ Incorrect') : 'Select an option'}
        </span>
        <Button onClick={onNext} disabled={selectedAnswer === null}>
          {isLast ? 'Finish' : 'Next →'}
        </Button>
      </CardFooter>
    </Card>
  );
}