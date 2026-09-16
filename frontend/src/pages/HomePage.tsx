import { useVocabulary } from '@/hooks/useVocabulary';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const { words, totalWords } = useVocabulary();
  const { bookmarks } = useBookmarks();
  const { user } = useAuth();

  const randomWord = words?.[Math.floor(Math.random() * words.length)];

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

  const quickActions = [
    { emoji: '🎴', label: 'Flashcards', to: '/flashcards' },
    { emoji: '🧠', label: 'Quiz', to: '/quiz' },
    { emoji: '🔄', label: 'Revision', to: '/revision' },
    { emoji: '🎙️', label: 'AI Coach', to: '/ai-agent' },
  ];

  const weekBars = [40, 65, 30, 80, 55, 90, 70];
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const continueLearning = words.slice(0, 3).map((w, i) => ({
    word: w,
    progress: [60, 30, 85][i] || 50,
  }));

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
          Welcome back{user?.username ? `, ${user.username}` : ''}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Let's continue your vocabulary journey
        </p>
      </div>

      {/* Streak Banner */}
      <div className="relative overflow-hidden rounded-2xl gradient-bg p-6 lg:p-8 text-white shadow-xl shadow-primary/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl animate-flicker">🔥</span>
              <div>
                <p className="text-white/80 text-xs font-medium tracking-wider uppercase">
                  Current Streak
                </p>
                <p className="text-3xl font-bold">7 days</p>
              </div>
            </div>
            <p className="text-white/90 text-sm">
              Keep it up! You're on fire 🔥
            </p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-white/80 text-xs">Today's goal</p>
            <p className="text-4xl font-bold">18/20</p>
            <p className="text-white/80 text-xs mt-1">words learned</p>
          </div>
        </div>
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -right-4 -bottom-12 w-32 h-32 rounded-full bg-white/5" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="p-5 border-border/60 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-lg">
                {stat.emoji}
              </div>
              <span className={`text-xs font-semibold ${stat.changeColor}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-2xl lg:text-3xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.to}
                  className="group p-4 rounded-xl bg-muted/50 border border-border/60 hover:border-primary hover:-translate-y-0.5 transition-all text-center"
                >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                    {action.emoji}
                  </div>
                  <p className="text-xs font-medium">{action.label}</p>
                </Link>
              ))}
            </div>
          </Card>

          {/* Continue Learning */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Continue Learning</h3>
              <Link
                to="/vocabulary"
                className="text-xs text-primary font-medium hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {continueLearning.map(({ word, progress }) => (
                <Link
                  key={word.id}
                  to="/vocabulary"
                  className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {word.word.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{word.word}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {word.englishMeaning}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full gradient-bg rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {progress}%
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Word of the Day */}
          {randomWord && (
            <Card className="p-6 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full gradient-bg opacity-10" />
              <div className="flex items-center gap-2 mb-3 relative z-10">
                <span className="text-lg">📖</span>
                <h3 className="font-semibold text-sm">Word of the Day</h3>
              </div>
              <p className="text-2xl font-bold gradient-text mb-1 relative z-10">
                {randomWord.word}
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                {randomWord.pronunciation}
              </p>
              <p className="text-sm mb-2">{randomWord.englishMeaning}</p>
              <p className="text-xs text-muted-foreground italic mb-4 line-clamp-2">
                "{randomWord.sentence}"
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 gradient-bg hover:opacity-90 text-white"
                  onClick={() => {
                    if ('speechSynthesis' in window) {
                      const u = new SpeechSynthesisUtterance(randomWord.word);
                      u.lang = 'en-US';
                      u.rate = 0.9;
                      window.speechSynthesis.speak(u);
                    }
                  }}
                >
                  <Volume2 className="h-3.5 w-3.5 mr-1.5" /> Listen
                </Button>
              </div>
            </Card>
          )}

          {/* Weekly Mini Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">This Week</h3>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="flex items-end justify-between h-24 gap-1.5">
              {weekBars.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div
                    className="w-full rounded-t-md gradient-bg hover:opacity-80 transition-all"
                    style={{ height: `${h}%` }}
                    title={`${h / 5} words`}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    {weekDays[i]}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Streak mini card */}
          <Card className="p-6 gradient-bg text-white relative overflow-hidden border-0">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🔥</span>
                <p className="text-xs font-medium uppercase tracking-wider opacity-90">
                  Milestone
                </p>
              </div>
              <p className="text-lg font-bold">7-day streak!</p>
              <p className="text-xs text-white/80 mt-1">
                3 more days to unlock 🏆
              </p>
            </div>
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10" />
          </Card>
        </div>
      </div>
    </div>
  );
}