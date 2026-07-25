import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppLayout from '@/components/layout/AppLayout';
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
import ProtectedRoute from '@/routes/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/vocabulary" element={<VocabularyPage />} />
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/flashcards" element={<FlashcardsPage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/revision" element={<RevisionPage />} />
                <Route path="/bookmarks" element={<BookmarksPage />} />
                <Route path="/progress" element={<ProgressPage />} />
              </Route>
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

