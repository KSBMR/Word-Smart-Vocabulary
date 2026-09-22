import { useNavigate } from 'react-router-dom';
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';
import { useBookmarks } from '@/hooks/useBookmarks';
import { RequireAuthOverlay } from '@/components/RequireAuthOverlay';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  AlertTriangle,
  Clock,
  Calendar,
  CalendarDays,
  Target,
  Bookmark,
  Flame,
  Shuffle,
  TrendingUp,
  Play,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Bucket {
  id: string;
  emoji: string;
  title: string;
  description: string;
  count: number;
  variant: 'danger' | 'warning' | 'primary' | 'success';
  icon: any;
  route: string;
}

export default function RevisionPage() {
  const navigate = useNavigate();
  const { getDueBuckets, resetProgress, store } = useSpacedRepetition();
  const { bookmarks } = useBookmarks();

  const buckets = getDueBuckets();
  const totalCards = Object.keys(store).length;
  const masteryPercent =
    totalCards > 0
      ? Math.round(
          (Object.values(store).filter((c) => c.repetitions >= 3).length /
            totalCards) *
            100
        )
      : 0;

  const dueBuckets: Bucket[] = [
    {
      id: 'forgotten',
      emoji: '🚨',
      title: 'Forgotten Words',
      description: 'যেসব word বেশি ভুলে যান — priority review',
      count: buckets.forgotten,
      variant: 'danger',
      icon: AlertTriangle,
      route: '/flashcards',
    },
    {
      id: 'yesterday',
      emoji: '📅',
      title: 'Yesterday',
      description: 'গতকালের words — memory fresh',
      count: buckets.yesterday,
      variant: 'warning',
      icon: Calendar,
      route: '/flashcards',
    },
    {
      id: 'threeDays',
      emoji: '⏰',
      title: '3 Days Ago',
      description: 'Medium-term review',
      count: buckets.threeDays,
      variant: 'primary',
      icon: Clock,
      route: '/flashcards',
    },
    {
      id: 'sevenDays',
      emoji: '📆',
      title: '7 Days Ago',
      description: 'Weekly revision',
      count: buckets.sevenDays,
      variant: 'primary',
      icon: CalendarDays,
      route: '/flashcards',
    },
    {
      id: 'thirtyDays',
      emoji: '🎯',
      title: '30 Days Ago',
      description: 'Long-term memory test',
      count: buckets.thirtyDays,
      variant: 'success',
      icon: Target,
      route: '/flashcards',
    },
  ];

  const smartBuckets: Bucket[] = [
    {
      id: 'bookmarked',
      emoji: '🔖',
      title: 'Bookmarked',
      description: 'আপনার saved words',
      count: bookmarks.length,
      variant: 'primary',
      icon: Bookmark,
      route: '/flashcards',
    },
    {
      id: 'hard',
      emoji: '🔥',
      title: 'Hard Words',
      description: 'যেসব word কঠিন লেগেছে',
      count: buckets.forgotten,
      variant: 'warning',
      icon: Flame,
      route: '/flashcards',
    },
    {
      id: 'random',
      emoji: '🎲',
      title: 'Random Review',
      description: 'যেকোনো word randomly',
      count: -1,
      variant: 'primary',
      icon: Shuffle,
      route: '/flashcards',
    },
  ];

  const totalDue = buckets.total;

  return (
    <RequireAuthOverlay featureName="Revision">
      <div className="space-y-5 md:space-y-6 animate-page-fade">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
              Revision 🔄
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Spaced repetition system — long-term memory build করুন
            </p>
          </div>

          {totalCards > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl h-9 gap-1.5 text-xs"
              onClick={() => {
                if (confirm('Reset all spaced repetition progress?')) {
                  resetProgress();
                }
              }}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          )}
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          <Card className="p-3 md:p-4">
            <div className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Due Today
            </div>
            <div className="text-xl md:text-2xl font-extrabold text-red-500">
              {totalDue}
            </div>
          </Card>
          <Card className="p-3 md:p-4">
            <div className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Total Cards
            </div>
            <div className="text-xl md:text-2xl font-extrabold">{totalCards}</div>
          </Card>
          <Card className="p-3 md:p-4">
            <div className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Mastery
            </div>
            <div className="text-xl md:text-2xl font-extrabold gradient-text">
              {masteryPercent}%
            </div>
          </Card>
        </div>

        {/* Big CTA */}
        <div className="rounded-2xl gradient-bg p-5 md:p-6 relative overflow-hidden text-white shadow-xl shadow-primary/20">
          <div className="relative z-10">
            <div className="text-[11px] font-bold uppercase tracking-wider opacity-90 mb-1">
              Today's Revision
            </div>
            <div className="text-4xl md:text-5xl font-extrabold leading-none mb-2">
              {totalDue}
            </div>
            <div className="text-xs md:text-sm opacity-90 mb-5">
              {totalDue > 0
                ? 'words ready for review'
                : 'No cards due — start learning!'}
            </div>

            <Button
              onClick={() => navigate('/flashcards')}
              disabled={totalDue === 0 && totalCards === 0}
              className="w-full bg-white text-primary hover:bg-white/90 rounded-xl h-11 gap-2 font-bold shadow-lg"
            >
              <Play className="h-4 w-4 fill-current" />
              {totalDue > 0 ? 'Start Revision' : 'Start Learning'}
            </Button>
          </div>
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -right-4 -bottom-12 w-32 h-32 rounded-full bg-white/5" />
        </div>

        {/* Buckets */}
        <div>
          <h2 className="text-sm md:text-base font-bold uppercase tracking-wider text-muted-foreground mb-3">
            📚 Revision Buckets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dueBuckets.map((bucket) => (
              <BucketCard
                key={bucket.id}
                bucket={bucket}
                onClick={() => navigate(bucket.route)}
              />
            ))}
          </div>
        </div>

        {/* Smart Options */}
        <div>
          <h2 className="text-sm md:text-base font-bold uppercase tracking-wider text-muted-foreground mb-3">
            💡 Smart Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {smartBuckets.map((bucket) => (
              <BucketCard
                key={bucket.id}
                bucket={bucket}
                onClick={() => navigate(bucket.route)}
              />
            ))}
          </div>
        </div>

        {/* Tips */}
        <Card className="p-5 border-primary/30 bg-primary/5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shrink-0">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm mb-1">
                How Spaced Repetition Works
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                যেসব word আপনি সহজে মনে রাখেন, সেগুলো কম frequently দেখানো হয়।
                যেগুলো কঠিন, সেগুলো বেশি বার review করা হয়। এভাবে memory
                long-term এ থাকে।
              </p>
            </div>
          </div>
        </Card>
      </div>
    </RequireAuthOverlay>
  );
}

function BucketCard({ bucket, onClick }: { bucket: Bucket; onClick: () => void }) {
  const variantClass = {
    danger: { border: 'border-red-500/30', text: 'text-red-500', bg: 'bg-red-500/10' },
    warning: { border: 'border-amber-500/30', text: 'text-amber-500', bg: 'bg-amber-500/10' },
    primary: { border: 'border-primary/30', text: 'text-primary', bg: 'bg-primary/10' },
    success: { border: 'border-emerald-500/30', text: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  }[bucket.variant];

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-4 rounded-2xl border-2 bg-card hover:-translate-y-0.5 transition-all hover:shadow-lg',
        variantClass.border
      )}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0',
              variantClass.bg
            )}
          >
            {bucket.emoji}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-sm">{bucket.title}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
              {bucket.count === -1 ? '∞' : `${bucket.count} words`}
            </div>
          </div>
        </div>
        {bucket.count > 0 && (
          <div
            className={cn(
              'px-3 py-1 rounded-full text-xs font-extrabold shrink-0',
              variantClass.bg,
              variantClass.text
            )}
          >
            {bucket.count}
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground leading-snug">
        {bucket.description}
      </p>
    </button>
  );
}