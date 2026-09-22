import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppLayout from '@/components/layout/AppLayout';
import { AuthModal } from '@/components/auth/AuthModal';

import HomePage from '@/pages/HomePage';
import VocabularyPage from '@/pages/VocabularyPage';
import AnalogyPage from '@/pages/AnalogyPage';
import FlashcardsPage from '@/pages/FlashcardsPage';
import QuizPage from '@/pages/QuizPage';
import RevisionPage from '@/pages/RevisionPage';
import BookmarksPage from '@/pages/BookmarksPage';
import ProgressPage from '@/pages/ProgressPage';
import SettingsPage from '@/pages/SettingsPage';
import AIAgentPage from '@/pages/AIAgentPage';
import NotFoundPage from '@/pages/NotFoundPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthModal />
            <Routes>
              <Route element={<AppLayout />}>
                {/* Public */}
                <Route path="/" element={<HomePage />} />
                <Route path="/vocabulary" element={<VocabularyPage />} />
                <Route path="/analogy" element={<AnalogyPage />} />
                <Route path="/settings" element={<SettingsPage />} />

                {/* Protected — all inside AppLayout so sidebar shows */}
                <Route path="/flashcards" element={<FlashcardsPage />} />
                <Route path="/ai-agent" element={<AIAgentPage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/revision" element={<RevisionPage />} />
                <Route path="/bookmarks" element={<BookmarksPage />} />
                <Route path="/progress" element={<ProgressPage />} />

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;