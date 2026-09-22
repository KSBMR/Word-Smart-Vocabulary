import { Link, useNavigate } from 'react-router-dom';
import { useVocabulary } from '@/hooks/useVocabulary';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModal } from '@/store/authModalStore';
import { useSpeech } from '@/hooks/useSpeech';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Volume2,
  TrendingUp,
  Sparkles,
  Lock,
  ArrowRight,
  Flame,
  Zap,
  BookOpen,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ==================== QUICK ACTIONS CONFIG ====================
interface QuickAction {
  emoji: string;
  label: string;
  to: string;
  protected: boolean;
  gradient: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    emoji: '🎴',
    label: 'Flashcards',
    to: '/flashcards',
    protected: true,
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    emoji: '🧠',
    label: 'Quiz',
    to: '/quiz',
    protected: false,
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    emoji: '🔄',
    label: 'Revision',
    to: '/revision',
    protected: true,
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    emoji: '🎙️',
    label: 'AI Coach',
    to: '/ai-agent',
    protected: true,
    gradient: 'from-violet-500 to-purple-500',
  },
];

export default function HomePage() {
  // ==================== HOOKS (all at top) ====================
  const { words, totalWords } = useVocabulary();
  const { bookmarks } = useBookmarks();
  const { user, isAuthenticated } = useAuth();
  const { openModal } = useAuthModal();
  const speak = useSpeech();
  const navigate = useNavigate();

  // ==================== DERIVED DATA ====================
  const randomWord =
    words && words.length > 0
      ? words[Math.floor(Math.random() * words.length)]
      : null;

  const stats = [
    {
      emoji: '📚',
      label: 'Total Words',
      value: totalWords.toLocaleString(),
      change: '+12%',
      changeColor: 'text-emerald-500',
    },
    {
      emoji: '🔖',
      label: 'Bookmarks',
      value: bookmarks.length.toString(),
      change: `+${bookmarks.length}`,
      changeColor: 'text-emerald-500',
    },
    {
      emoji: '✅',
      label: 'Words Learned',
      value: '342',
      change: '+18',
      changeColor: 'text-emerald-500',
    },
    {
      emoji: '⚡',
      label: 'XP Earned',
      value: '1,240',
      change: '+5',
      changeColor: 'text-amber-500',
    },
  ];

  const weekBars = [40, 65, 30, 80, 55, 90, 70];
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const continueLearning = words.slice(0, 3).map((w, i) => ({
    word: w,
    progress: [60, 30, 85][i] || 50,
  }));

  // ==================== HANDLERS ====================
  const handleQuickAction = (
    e: React.MouseEvent,
    action: QuickAction
  ) => {
    if (action.protected && !isAuthenticated) {
      e.preventDefault();
      openModal('login');
    }
  };

  const handleSpeakWord = (text: string) => {
    speak(text);
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-page-fade">
      {/* ==================== WELCOME HEADER ==================== */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
            Welcome back{user?.username ? `, ${user.username}` : ''}! 👋
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Let's continue your vocabulary journey
          </p>
        </div>

        {/* Login CTA — only when logged out */}
        {!isAuthenticated && (
          <Button
            onClick={() => openModal('login')}
            className="gradient-bg hover:opacity-90 text-white rounded-xl h-10 px-4 gap-1.5 shadow-lg shadow-primary/25 shrink-0 self-start sm:self-auto"
          >
            <Sparkles className="h-4 w-4" />
            Unlock Full Access
          </Button>
        )}
      </div>

      {/* ==================== STREAK BANNER ==================== */}
      <div className="relative overflow-hidden rounded-2xl gradient-bg p-5 md:p-7 text-white shadow-xl shadow-primary/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="text-3xl md:text-4xl animate-flicker inline-block">
                🔥
              </span>
              <div>
                <p className="text-white/80 text-[10px] md:text-xs font-bold tracking-wider uppercase">
                  Current Streak
                </p>
                <p className="text-2xl md:text-3xl font-bold leading-tight">
                  7 days
                </p>
              </div>
            </div>
            <p className="text-white/90 text-xs md:text-sm">
              Keep it up! You're on fire 🔥
            </p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-white/80 text-[10px] md:text-xs uppercase tracking-wider font-bold">
              Today's goal
            </p>
            <p className="text-3xl md:text-4xl font-bold leading-tight">
              18<span className="text-xl md:text-2xl opacity-70">/20</span>
            </p>
            <p className="text-white/80 text-[10px] md:text-xs mt-0.5">
              words learned
            </p>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-8 -top-8 w-32 md:w-40 h-32 md:h-40 rounded-full bg-white/10" />
        <div className="absolute -right-4 -bottom-10 w-24 md:w-32 h-24 md:h-32 rounded-full bg-white/5" />
      </div>

      {/* ==================== STATS GRID ==================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="p-4 md:p-5 border-border/60 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-muted flex items-center justify-center text-lg">
                {stat.emoji}
              </div>
              <span
                className={cn(
                  'text-[10px] md:text-xs font-bold',
                  stat.changeColor
                )}
              >
                {stat.change}
              </span>
            </div>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold">
              {stat.value}
            </p>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">
              {stat.label}
            </p>
          </Card>
        ))}
      </div>

      {/* ==================== MAIN GRID ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* ============ LEFT COLUMN (2/3) ============ */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* ---- Quick Actions ---- */}
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm md:text-base">
                Quick Actions
              </h3>
              {!isAuthenticated && (
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Login for more
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 md:gap-3">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.label}
                  to={action.to}
                  onClick={(e) => handleQuickAction(e, action)}
                  className={cn(
                    'group relative p-3 md:p-4 rounded-xl text-center transition-all duration-200',
                    'bg-muted/50 border border-border/60',
                    'hover:border-primary/50 hover:-translate-y-0.5 hover:shadow-md',
                    action.protected &&
                      !isAuthenticated &&
                      'opacity-80'
                  )}
                >
                  {/* Lock badge */}
                  {action.protected && !isAuthenticated && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-sm border border-border/60">
                      <Lock className="h-2.5 w-2.5 text-muted-foreground" />
                    </div>
                  )}

                  {/* Gradient ring on hover */}
                  <div
                    className={cn(
                      'absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none',
                      'bg-gradient-to-br',
                      action.gradient,
                      'opacity-0 group-hover:opacity-10'
                    )}
                  />

                  <div className="relative">
                    <div className="text-2xl md:text-3xl mb-1.5 group-hover:scale-110 transition-transform duration-200">
                      {action.emoji}
                    </div>
                    <p className="text-[11px] md:text-xs font-semibold truncate">
                      {action.label}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          {/* ---- Continue Learning ---- */}
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm md:text-base">
                Continue Learning
              </h3>
              <Link
                to="/vocabulary"
                className="text-[11px] md:text-xs text-primary font-medium hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {continueLearning.map(({ word, progress }) => (
                <Link
                  key={word.id}
                  to="/vocabulary"
                  className="flex items-center gap-3 p-2.5 md:p-3 rounded-xl bg-muted/50 hover:bg-muted transition cursor-pointer"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-sm md:text-base shrink-0">
                    {word.word.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[13px] md:text-sm truncate">
                      {word.word}
                    </p>
                    <p className="text-[11px] md:text-xs text-muted-foreground truncate">
                      {word.englishMeaning}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="w-16 md:w-20 h-1.5 md:h-2 bg-background rounded-full overflow-hidden">
                      <div
                        className="h-full gradient-bg rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-[9px] md:text-[10px] text-muted-foreground mt-1">
                      {progress}%
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        {/* ============ RIGHT COLUMN (1/3) ============ */}
        <div className="space-y-4 md:space-y-6">
          {/* ---- Word of the Day ---- */}
          {randomWord && (
            <Card className="p-5 md:p-6 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full gradient-bg opacity-10" />

              <div className="flex items-center gap-2 mb-3 relative z-10">
                <span className="text-lg">📖</span>
                <h3 className="font-semibold text-xs md:text-sm">
                  Word of the Day
                </h3>
              </div>

              <p className="text-xl md:text-2xl font-bold gradient-text mb-1 relative z-10">
                {randomWord.word}
              </p>
              <p className="text-[10px] md:text-xs text-muted-foreground mb-3 font-mono">
                {randomWord.pronunciation}
              </p>
              <p className="text-[13px] md:text-sm mb-2 line-clamp-2">
                {randomWord.englishMeaning}
              </p>
              <p className="text-[11px] md:text-xs text-muted-foreground italic mb-4 line-clamp-2">
                "{randomWord.sentence}"
              </p>

              <Button
                size="sm"
                onClick={() => handleSpeakWord(randomWord.word)}
                className="w-full gradient-bg hover:opacity-90 text-white rounded-xl gap-1.5 h-9 md:h-10 text-xs md:text-sm font-semibold"
              >
                <Volume2 className="h-3.5 w-3.5" />
                Listen
              </Button>
            </Card>
          )}

          {/* ---- Weekly Chart ---- */}
          <Card className="p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-xs md:text-sm">This Week</h3>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>

            <div className="flex items-end justify-between h-20 md:h-24 gap-1.5">
              {weekBars.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1.5"
                >
                  <div
                    className="w-full rounded-t-md gradient-bg hover:opacity-80 transition-all cursor-pointer"
                    style={{ height: `${h}%` }}
                    title={`${h / 5} words`}
                  />
                  <span className="text-[9px] md:text-[10px] text-muted-foreground">
                    {weekDays[i]}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* ---- Milestone Card ---- */}
          <Card className="p-5 md:p-6 gradient-bg text-white relative overflow-hidden border-0">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-4 w-4" />
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider opacity-90">
                  Milestone
                </p>
              </div>
              <p className="text-base md:text-lg font-bold">
                7-day streak!
              </p>
              <p className="text-[11px] md:text-xs text-white/80 mt-1">
                3 more days to unlock 🏆
              </p>
            </div>
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10" />
          </Card>

          {/* ---- Login Promo (logged out) ---- */}
          {!isAuthenticated && (
            <Card className="p-5 md:p-6 border-2 border-primary/30 bg-primary/5 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-md shadow-primary/30">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      Unlock Full Access
                    </p>
                    <p className="text-sm font-bold">Save Your Progress</p>
                  </div>
                </div>

                <ul className="space-y-1.5 mb-4">
                  {[
                    { icon: BookOpen, text: 'Track every word learned' },
                    { icon: Target, text: 'Personal revision plan' },
                    { icon: Zap, text: 'Streaks & XP rewards' },
                  ].map(({ icon: Icon, text }) => (
                    <li
                      key={text}
                      className="flex items-center gap-2 text-[11px] md:text-xs text-muted-foreground"
                    >
                      <Icon className="h-3 w-3 text-primary shrink-0" />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => openModal('login')}
                  className="w-full gradient-bg hover:opacity-90 text-white rounded-xl h-10 gap-2 shadow-lg shadow-primary/25 text-sm font-semibold"
                >
                  <Sparkles className="h-4 w-4" />
                  Sign Up Free
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}