import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import HomePage from '@/pages/HomePage'
import VocabularyPage from '@/pages/VocabularyPage'
import FlashcardsPage from '@/pages/FlashcardsPage'
import QuizPage from '@/pages/QuizPage'
import RevisionPage from '@/pages/RevisionPage'
import BookmarksPage from '@/pages/BookmarksPage'
import ProgressPage from '@/pages/ProgressPage'
import SettingsPage from '@/pages/SettingsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'vocabulary', element: <VocabularyPage /> },
      { path: 'flashcards', element: <FlashcardsPage /> },
      { path: 'quiz', element: <QuizPage /> },
      { path: 'revision', element: <RevisionPage /> },
      { path: 'bookmarks', element: <BookmarksPage /> },
      { path: 'progress', element: <ProgressPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
])