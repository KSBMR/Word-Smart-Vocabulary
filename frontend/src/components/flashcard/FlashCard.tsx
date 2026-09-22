import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Volume2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSpeech } from '@/hooks/useSpeech';

interface WordCardData {
  id: number;
  word: string;
  pronunciation: string;
  englishMeaning: string;
  banglaMeaning: string;
  sentence: string;
  book: number;
  lesson: number;
}

interface WordFlashCardProps {
  data: WordCardData;
  flipped: boolean;
  onFlip: () => void;
}

export function WordFlashCard({ data, flipped, onFlip }: WordFlashCardProps) {
  const speak = useSpeech();

  return (
    <div
      onClick={onFlip}
      className="relative w-full h-full cursor-pointer"
      style={{ perspective: '1500px' }}
    >
      <div
        className={cn(
          'relative w-full h-full transition-transform duration-700 ease-out',
          'transform-gpu'
        )}
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 rounded-3xl border-2 border-border bg-card p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-xl"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <div className="absolute top-0 left-0 right-0 h-1 gradient-bg rounded-t-3xl" />

          {/* Tag */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full gradient-bg">
            <Tag className="h-3 w-3 text-white" />
            <span className="text-[10px] font-bold text-white">
              WS {data.book} · L{data.lesson}
            </span>
          </div>

          {/* Word */}
          <div className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 leading-tight">
            {data.word}
          </div>

          {/* Pronunciation */}
          <div className="text-sm text-muted-foreground font-mono mb-6">
            {data.pronunciation}
          </div>

          {/* Speak Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              speak(data.word);
            }}
            className="rounded-full gap-1.5"
          >
            <Volume2 className="h-3.5 w-3.5" />
            Listen
          </Button>

          {/* Hint */}
          <div className="absolute bottom-6 left-0 right-0 text-center">
            <p className="text-[11px] text-muted-foreground">
              👆 Tap to reveal meaning
            </p>
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 rounded-3xl border-2 border-primary/40 bg-card p-6 md:p-8 flex flex-col shadow-xl overflow-y-auto"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-1 gradient-bg rounded-t-3xl" />

          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full gradient-bg">
            <Tag className="h-3 w-3 text-white" />
            <span className="text-[10px] font-bold text-white">
              WS {data.book} · L{data.lesson}
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-5 mt-8">
            {/* English */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                English Meaning
              </p>
              <p className="text-lg md:text-xl font-semibold leading-snug">
                {data.englishMeaning}
              </p>
            </div>

            {/* Bangla */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Bangla Meaning
              </p>
              <p className="text-base md:text-lg text-foreground/80 leading-snug">
                {data.banglaMeaning}
              </p>
            </div>

            {/* Example */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Example
              </p>
              <div className="p-3 rounded-xl bg-muted/60 border-l-[3px] border-primary">
                <p className="text-[13px] italic leading-relaxed">
                  "{data.sentence}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}