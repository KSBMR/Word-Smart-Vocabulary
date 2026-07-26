import { useVocabulary } from '@/hooks/useVocabulary';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BookOpen, Bookmark, Library } from 'lucide-react';

export default function HomePage() {
  const { totalWords, words } = useVocabulary();
  const { bookmarks } = useBookmarks();
  const randomWord = words?.[Math.floor(Math.random() * words.length)];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome! 👋</h2>
        <p className="text-muted-foreground">Learn vocabulary with Word Smart.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/flashcards"><Button variant="outline">📚 Flashcards</Button></Link>
        <Link to="/quiz"><Button>🧠 Quiz</Button></Link>
        <Link to="/revision"><Button variant="outline">🔄 Revision</Button></Link>
        <Link to="/vocabulary"><Button variant="default">📖 Browse Vocabulary</Button></Link>
      </div>

      <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-primary/20" onClick={() => window.location.href = '/vocabulary'}>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h3 className="text-xl font-semibold">📖 Browse All Vocabulary</h3>
            <p className="text-muted-foreground">Explore {totalWords} words from Word Smart 1 & 2</p>
          </div>
          <Library className="h-8 w-8 text-muted-foreground" />
        </CardContent>
      </Card>

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