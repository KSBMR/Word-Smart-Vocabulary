import { useWeeklyActivity } from '@/hooks/useWeeklyActivity';
import { useAuth } from '@/hooks/useAuth';
import { useBookmarks } from '@/hooks/useBookmarks';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns'; // install: npm install date-fns

export default function ProgressPage() {
  const { user } = useAuth();
  const { bookmarks } = useBookmarks();
  const { data, loading } = useWeeklyActivity();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalWordsLearned = data.reduce((sum, d) => sum + d.words_learned_count, 0);
  const totalQuizCorrect = data.reduce((sum, d) => sum + d.quiz_correct, 0);
  const totalQuizAttempts = data.reduce((sum, d) => sum + d.quiz_attempts, 0);
  const accuracy = totalQuizAttempts > 0 ? Math.round((totalQuizCorrect / totalQuizAttempts) * 100) : 0;

  // Format dates for display
  const chartData = data.map((d) => ({
    date: format(new Date(d.date), 'EEE'), // Mon, Tue, etc.
    learned: d.words_learned_count,
    quizzes: d.quiz_attempts,
    revisions: d.revisions_done,
    flashcards: d.flashcards_studied,
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Progress</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Words Learned (7d)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalWordsLearned}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Quiz Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{accuracy}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bookmarks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{bookmarks.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Quiz Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalQuizAttempts}</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="learned" fill="#3B82F6" name="Words Learned" />
              <Bar dataKey="quizzes" fill="#8B5CF6" name="Quiz Attempts" />
              <Bar dataKey="revisions" fill="#10B981" name="Revisions" />
              <Bar dataKey="flashcards" fill="#F59E0B" name="Flashcards" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}