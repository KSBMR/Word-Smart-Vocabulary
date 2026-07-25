import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppLayout from '@/components/layout/AppLayout';
import { AuthModal } from '@/components/auth/AuthModal';
import { ProtectedPage } from '@/components/ProtectedPage';
import HomePage from '@/pages/HomePage';
import VocabularyPage from '@/pages/VocabularyPage';
import FlashcardsPage from '@/pages/FlashcardsPage';
import QuizPage from '@/pages/QuizPage';
import RevisionPage from '@/pages/RevisionPage';
import BookmarksPage from '@/pages/BookmarksPage';
import ProgressPage from '@/pages/ProgressPage';
import SettingsPage from '@/pages/SettingsPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthModal />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/vocabulary" element={<VocabularyPage />} />
              {/* Protected routes */}
              <Route
                path="/flashcards"
                element={
                  <ProtectedPage>
                    <FlashcardsPage />
                  </ProtectedPage>
                }
              />
              <Route
                path="/quiz"
                element={
                  <ProtectedPage>
                    <QuizPage />
                  </ProtectedPage>
                }
              />
              <Route
                path="/revision"
                element={
                  <ProtectedPage>
                    <RevisionPage />
                  </ProtectedPage>
                }
              />
              <Route
                path="/bookmarks"
                element={
                  <ProtectedPage>
                    <BookmarksPage />
                  </ProtectedPage>
                }
              />
              <Route
                path="/progress"
                element={
                  <ProtectedPage>
                    <ProgressPage />
                  </ProtectedPage>
                }
              />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;


// import { RouterProvider } from 'react-router-dom'
// import { ThemeProvider } from '@/contexts/ThemeContext'
// import { router } from '@/routes'
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// const queryClient = new QueryClient()

// function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <ThemeProvider>
//         <RouterProvider router={router} />
//       </ThemeProvider>
//     </QueryClientProvider>
//   )
// }

// export default App

