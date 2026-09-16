import { useAuth } from '@/contexts/AuthContext';
import { useAuthModal } from '@/store/authModalStore';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Award } from 'lucide-react';

export default function ProgressPage() {
  const { isAuthenticated } = useAuth();
  const { openModal } = useAuthModal();
  const { bookmarks } = useBookmarks();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <Card className="max-w-md w-full text-center p-8">
          <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-xl font-bold mb-2">Login Required</h2>
          <p className="text-sm text-muted-foreground mb-6">
            You need to login to view your learning progress.
          </p>
          <Button
            onClick={() => openModal('login')}
            className="w-full gradient-bg hover:opacity-90"
          >
            Login / Sign Up
          </Button>
        </Card>
      </div>
    );
  }

  const stats = [
    { label: 'Words Learned', value: '342', sub: '↑ 18 this week', subColor: 'text-emerald-500' },
    { label: 'Quiz Accuracy', value: '87%', sub: '↑ 5% vs last week', subColor: 'text-emerald-500' },
    { label: 'Study Streak', value: '7 days', sub: '🔥 Personal best!', subColor: 'text-muted-foreground' },
    { label: 'Total XP', value: '1,240', sub: 'Level 6 · 240/500', subColor: 'text-muted-foreground' },
  ];

  const weekData = [
    { day: 'Mon', learned: 40, quiz: 30 },
    { day: 'Tue', learned: 65, quiz: 45 },
    { day: 'Wed', learned: 30, quiz: 20 },
    { day: 'Thu', learned: 80, quiz: 60 },
    { day: 'Fri', learned: 55, quiz: 40 },
    { day: 'Sat', learned: 90, quiz: 70 },
    { day: 'Sun', learned: 70, quiz: 55 },
  ];

  const achievements = [
    { icon: '🔥', name: '7-day streak', earned: true },
    { icon: '🏆', name: '100 words', earned: true },
    { icon: '⚡', name: 'Speed quiz', earned: true },
    { icon: '🎯', name: 'Perfect score', earned: true },
    { icon: '📚', name: 'Book master', earned: false },
    { icon: '💎', name: 'Level 10', earned: false },
  ];

  const recentActivity = [
    { icon: '✅', text: 'Learned Aberration', time: '2m ago' },
    { icon: '🧠', text: 'Quiz: 8/10 correct', time: '1h ago' },
    { icon: '🔖', text: 'Bookmarked Abeyance', time: '3h ago' },
    { icon: '🎙️', text: 'AI speaking session', time: '5h ago' },
    { icon: '🔄', text: 'Revised 12 words', time: 'yesterday' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
            Your Progress 📊
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your vocabulary learning journey
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-xl">
            This Week
          </Button>
          <Button size="sm" className="rounded-xl gradient-bg hover:opacity-90">
            Export
          </Button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className="text-2xl lg:text-3xl font-bold gradient-text">
              {s.value}
            </p>
            <p className={`text-xs mt-2 ${s.subColor}`}>{s.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Activity Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold">Weekly Activity</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Words learned and quizzes taken
                </p>
              </div>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Learned</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <span className="text-muted-foreground">Quiz</span>
                </div>
              </div>
            </div>
            <div className="flex items-end justify-between h-48 gap-3">
              {weekData.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex gap-1 items-end h-full">
                    <div
                      className="flex-1 rounded-t-md bg-primary hover:opacity-80 transition-all"
                      style={{ height: `${d.learned}%` }}
                      title={`${d.learned / 5} words learned`}
                    />
                    <div
                      className="flex-1 rounded-t-md bg-accent hover:opacity-80 transition-all"
                      style={{ height: `${d.quiz}%` }}
                      title={`${d.quiz / 5} quizzes`}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {d.day}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Heatmap */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">Activity Heatmap</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Last 12 weeks
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span>Less</span>
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((lvl) => (
                    <div
                      key={lvl}
                      className="w-3 h-3 rounded"
                      style={{
                        background: `hsl(var(--primary) / ${lvl * 0.25})`,
                      }}
                    />
                  ))}
                </div>
                <span>More</span>
              </div>
            </div>
            <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto">
              {Array.from({ length: 84 }, (_, i) => {
                const lvl = [0, 1, 2, 3, 4][Math.floor(Math.random() * 5)];
                return (
                  <div
                    key={i}
                    className="w-3 h-3 rounded"
                    style={{
                      background: `hsl(var(--primary) / ${lvl * 0.25})`,
                    }}
                    title={`Day ${i + 1}`}
                  />
                );
              })}
            </div>
          </Card>

          {/* Book Progress */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Book Progress</h3>
            <div className="space-y-5">
              {[
                { n: 1, name: 'Word Smart 1', words: '842 words', pct: 78 },
                { n: 2, name: 'Word Smart 2', words: '756 words', pct: 42 },
              ].map((book) => (
                <div key={book.n}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white text-xs font-bold">
                        {book.n}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{book.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {book.words}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold">{book.pct}%</span>
                  </div>
                  <div className="h-2 bg-accent/60 rounded-full overflow-hidden">
                    <div
                      className="h-full gradient-bg rounded-full transition-all"
                      style={{ width: `${book.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column (1/3) */}
        <div className="space-y-6">
          {/* Achievements */}
          <Card className="p-6">
            <h3 className="font-semibold text-sm mb-4">Achievements</h3>
            <div className="grid grid-cols-3 gap-3">
              {achievements.map((a) => (
                <div
                  key={a.name}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 ${
                    a.earned
                      ? 'bg-accent/60 border border-border/60'
                      : 'bg-accent/30 opacity-40'
                  }`}
                  title={a.name}
                >
                  <span className={`text-2xl ${a.earned ? '' : 'grayscale'}`}>
                    {a.icon}
                  </span>
                  <span className="text-[8px] text-muted-foreground text-center leading-tight px-1">
                    {a.name}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="font-semibold text-sm mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/60 flex items-center justify-center text-sm shrink-0">
                    {a.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{a.text}</p>
                    <p className="text-[10px] text-muted-foreground">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Level Progress */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" /> Level 6
              </h3>
              <span className="text-xs text-muted-foreground">240 / 500 XP</span>
            </div>
            <div className="h-2 bg-accent/60 rounded-full overflow-hidden">
              <div
                className="h-full gradient-bg rounded-full"
                style={{ width: '48%' }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              260 XP to Level 7 💪
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}