import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppLayout from '@/components/layout/AppLayout';
import { AuthModal } from '@/components/auth/AuthModal';

import HomePage from '@/pages/HomePage';
import VocabularyPage from '@/pages/VocabularyPage';
import FlashcardsPage from '@/pages/FlashcardsPage';
import QuizPage from '@/pages/QuizPage';
import RevisionPage from '@/pages/RevisionPage';
import BookmarksPage from '@/pages/BookmarksPage';
import ProgressPage from '@/pages/ProgressPage';
import SettingsPage from '@/pages/SettingsPage';
import AIAgentPage from '@/pages/AIAgentPage';
import { useAuth } from '@/contexts/AuthContext';
import AnalogyPage from '@/pages/AnalogyPage';

const queryClient = new QueryClient();

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          {/* Auth Modal is always mounted, opens globally */}
          <AuthModal />

          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/vocabulary" element={<VocabularyPage />} />
              <Route path="/analogy" element={<AnalogyPage />} />
              <Route path="/ai-agent" element={<AIAgentPage />} />   {/* ← যোগ করুন */}
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/revision" element={<RevisionPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;