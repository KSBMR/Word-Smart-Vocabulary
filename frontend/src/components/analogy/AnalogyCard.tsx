import { useState, useMemo } from 'react';
import { AnalogyQuestion } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle2, ChevronDown, Eye, Sparkles } from 'lucide-react';
import { cleanAnalogyItem } from '@/utils/cleanText';

interface AnalogyCardProps {
  question: AnalogyQuestion;
  status?: 'correct' | 'wrong' | 'seen' | 'new';
  showCoachMark?: boolean;
  onCoachDismiss?: () => void;
}

export function AnalogyCard({
  question,
  status = 'new',
  showCoachMark = false,
  onCoachDismiss,
}: AnalogyCardProps) {
  const [expanded, setExpanded] = useState(false);

  const cleaned = useMemo(() => cleanAnalogyItem(question), [question]);

  const handleTap = () => {
    setExpanded((prev) => !prev);
    if (showCoachMark && onCoachDismiss) {
      onCoachDismiss();
    }
  };

  const optionKeys = Object.keys(question.options) as Array<
    keyof typeof question.options
  >;

  const correctAnswerKey = question.answer;

  return (
    <div className="relative">
      <div
        onClick={handleTap}
        className={cn(
          'relative rounded-2xl border bg-card cursor-pointer',
          'transition-all duration-200 ease-out overflow-hidden',
          expanded
            ? 'border-primary/60 shadow-lg shadow-primary/10'
            : 'border-border/60 hover:border-primary/40 hover:shadow-md',
          showCoachMark &&
            !expanded &&
            'border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/20'
        )}
      >
        {/* Top accent bar (only when expanded) */}
        <div
          className={cn(
            'h-1 w-full transition-all duration-300',
            expanded
              ? 'bg-gradient-to-r from-primary to-accent'
              : 'bg-transparent'
          )}
        />

        <div className="p-4 md:p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
            <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
              Q#{question.sl}
            </span>

            {status === 'correct' && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Solved
              </span>
            )}
            {status === 'wrong' && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-600 dark:text-red-400 font-bold">
                ✗ Wrong
              </span>
            )}
            {status === 'seen' && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                <Eye className="h-3 w-3" /> Seen
              </span>
            )}
          </div>

          {/* Question — cleaned when collapsed, original when expanded */}
          <div className="mb-4">
            <p className="text-[15px] md:text-base font-bold leading-snug tracking-tight">
              {expanded ? question.question : cleaned.cleanedQuestion}
            </p>
            {expanded && cleaned.hasAnyBangla && cleaned.banglaQuestion && (
              <p className="text-[11px] md:text-xs text-muted-foreground mt-1.5 leading-relaxed">
                {cleaned.banglaQuestion}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-1.5">
            {optionKeys.map((key) => {
              const originalValue = question.options[key];
              const cleanedValue = cleaned.cleanedOptions[key];
              const banglaValue = cleaned.banglaOptions[key];
              const isCorrect = expanded && key === correctAnswerKey;

              return (
                <div
                  key={key}
                  className={cn(
                    'flex items-start gap-3 p-2.5 rounded-xl transition-all duration-200',
                    isCorrect
                      ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30'
                      : 'bg-transparent border border-transparent'
                  )}
                >
                  <span
                    className={cn(
                      'w-6 h-6 rounded-lg flex items-center justify-center shrink-0',
                      'text-[11px] font-bold transition-all',
                      isCorrect
                        ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/40'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {key}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'text-[13px] md:text-sm leading-snug',
                        isCorrect
                          ? 'font-semibold text-emerald-700 dark:text-emerald-400'
                          : 'text-foreground/90'
                      )}
                    >
                      {expanded ? originalValue : cleanedValue}
                    </p>

                    {/* Bangla hint (only expanded + only if present) */}
                    {expanded && banglaValue && (
                      <p
                        className={cn(
                          'text-[11px] mt-0.5 leading-snug',
                          isCorrect
                            ? 'text-emerald-600/80 dark:text-emerald-400/80'
                            : 'text-muted-foreground'
                        )}
                      >
                        {banglaValue}
                      </p>
                    )}
                  </div>

                  {isCorrect && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Reveal hint (collapsed) */}
          {!expanded && (
            <div className="mt-4 pt-3.5 border-t border-dashed border-border/60 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider shrink-0">
                  Answer
                </span>
                <span className="text-[12px] font-bold text-primary blur-[5px] select-none truncate">
                  {cleaned.cleanedOptions[correctAnswerKey] || '?'}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                <Sparkles className="h-3 w-3" />
                Tap
                <ChevronDown className="h-3 w-3" />
              </div>
            </div>
          )}

          {/* Explanation (expanded) */}
          <div
            className={cn(
              'overflow-hidden transition-all duration-300 ease-out',
              expanded ? 'max-h-[400px] opacity-100 mt-4' : 'max-h-0 opacity-0'
            )}
          >
            <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Explanation
                </span>
              </div>
              <p className="text-[13px] md:text-sm leading-relaxed text-foreground/90">
                {question.explanation}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Coach Mark */}
      {showCoachMark && (
        <div
          className="absolute top-[calc(100%+8px)] right-4 z-30 px-3 py-2 rounded-lg text-[11px] font-semibold text-white shadow-xl whitespace-nowrap animate-bounce-hint"
          style={{ background: '#0F172A' }}
        >
          👆 Tap করুন, answer দেখুন
          <div
            className="absolute -top-1.5 right-5 w-2.5 h-2.5 rotate-45"
            style={{ background: '#0F172A' }}
          />
        </div>
      )}
    </div>
  );
}