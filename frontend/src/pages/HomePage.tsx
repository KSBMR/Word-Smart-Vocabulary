import { useAuth } from '@/hooks/useAuth';
import { useVocabulary } from '@/hooks/useVocabulary';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useWeeklyActivity } from '@/hooks/useWeeklyActivity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BookOpen, Bookmark, Flame, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export default function HomePage() {
  const { user } = useAuth();
  const { totalWords } = useVocabulary();
  const { bookmarks } = useBookmarks();
  const { data, loading } = useWeeklyActivity();

  const wordsLearned = data?.reduce((sum, d) => sum + d.words_learned_count, 0) || 0;
  const totalQuiz = data?.reduce((sum, d) => sum + d.quiz_attempts, 0) || 0;

  // Random word for "Word of the Day"
  const randomWord = useVocabulary().words?.[Math.floor(Math.random() * useVocabulary().words.length)];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">
        Welcome{user ? `, ${user.username}` : ''}! 👋
      </h2>
      <p className="text-muted-foreground">Let's continue your vocabulary journey.</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Total Words
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalWords}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Bookmark className="h-4 w-4" /> Bookmarks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{bookmarks.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Flame className="h-4 w-4" /> Words Learned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{wordsLearned}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4" /> Quiz Attempts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalQuiz}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link to="/flashcards"><Button>📚 Flashcards</Button></Link>
        <Link to="/quiz"><Button variant="outline">🧠 Quiz</Button></Link>
        <Link to="/revision"><Button variant="outline">🔄 Revision</Button></Link>
      </div>

      {/* Weekly Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.map(d => ({ ...d, date: format(new Date(d.date), 'EEE') })) || []}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="words_learned_count" fill="#3B82F6" name="Learned" />
              <Bar dataKey="quiz_attempts" fill="#8B5CF6" name="Quizzes" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Word of the Day */}
      {randomWord && (
        <Card>
          <CardHeader>
            <CardTitle>📖 Word of the Day</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{randomWord.word}</p>
            <p className="text-muted-foreground">{randomWord.englishMeaning}</p>
            <p className="text-sm text-muted-foreground">{randomWord.banglaMeaning}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}