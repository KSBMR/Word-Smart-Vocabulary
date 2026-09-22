import { cn } from '@/lib/utils';
import { CheckCircle2, Sparkles, Tag } from 'lucide-react';

interface AnalogyData {
  sl: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
  };
  answer: string;
  explanation: string;
}

interface AnalogyFlashCardProps {
  data: AnalogyData;
  flipped: boolean;
  onFlip: () => void;
}

export function AnalogyFlashCard({ data, flipped, onFlip }: AnalogyFlashCardProps) {
  const options = Object.entries(data.options) as [string, string][];

  return (
    <div
      onClick={onFlip}
      className="relative w-full h-full cursor-pointer"
      style={{ perspective: '1500px' }}
    >
      <div
        className="relative w-full h-full transition-transform duration-700 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* FRONT — Question + Options */}
        <div
          className="absolute inset-0 rounded-3xl border-2 border-border bg-card p-5 md:p-6 flex flex-col shadow-xl overflow-y-auto"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <div className="absolute top-0 left-0 right-0 h-1 gradient-bg rounded-t-3xl" />

          {/* Tag */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full gradient-bg w-fit mb-4">
            <Tag className="h-3 w-3 text-white" />
            <span className="text-[10px] font-bold text-white">🔗 Analogy</span>
          </div>

          {/* Question */}
          <div className="text-lg md:text-xl font-extrabold tracking-tight mb-5 text-center leading-snug">
            {data.question}
          </div>

          {/* Options */}
          <div className="flex-1 space-y-2">
            {options.map(([key, val]) => (
              <div
                key={key}
                className="flex items-start gap-2.5 p-2.5 rounded-xl border border-border/60 bg-muted/30"
              >
                <span className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center font-bold text-[11px] shrink-0">
                  {key}
                </span>
                <span className="flex-1 text-[12.5px] md:text-[13px] leading-snug pt-0.5">
                  {val}
                </span>
              </div>
            ))}
          </div>

          {/* Hint */}
          <div className="text-center mt-4">
            <p className="text-[11px] text-muted-foreground">
              👆 Tap to reveal answer
            </p>
          </div>
        </div>

        {/* BACK — Answer + Explanation */}
        <div
          className="absolute inset-0 rounded-3xl border-2 border-primary/40 bg-card p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-xl overflow-y-auto"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-1 gradient-bg rounded-t-3xl" />

          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full gradient-bg">
            <Tag className="h-3 w-3 text-white" />
            <span className="text-[10px] font-bold text-white">🔗 Analogy</span>
          </div>

          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3 mt-6">
            Correct Answer
          </p>

          {/* Answer Key */}
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white text-2xl font-extrabold mb-4 shadow-lg shadow-emerald-500/30">
            {data.answer}
          </div>

          {/* Answer Text */}
          <p className="text-base md:text-lg font-bold mb-6 leading-snug">
            {data.options[data.answer as keyof typeof data.options]}
          </p>

          {/* Explanation */}
          <div className="w-full p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-left">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Explanation
              </span>
            </div>
            <p className="text-[13px] leading-relaxed text-foreground/90">
              {data.explanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}