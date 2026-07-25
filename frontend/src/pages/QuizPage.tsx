import { useState } from 'react'
import { useVocabulary } from '@/hooks/useVocabulary'
import { useBookmarks } from '@/hooks/useBookmarks'
import { useQuiz } from '@/hooks/useQuiz'
import { QuizQuestion } from '@/components/quiz/QuizQuestion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Bookmark, Shuffle } from 'lucide-react'
import { Vocabulary } from '@/types'

export default function QuizPage() {
  const { words, loading } = useVocabulary()
  const { bookmarks } = useBookmarks()
  const [quizType, setQuizType] = useState<'random' | 'bookmarked'>('random')
  const [quizStarted, setQuizStarted] = useState(false)

  // Get the word list based on quiz type
  const getWordList = (): Vocabulary[] => {
    if (quizType === 'bookmarked') {
      return words.filter(w => bookmarks.includes(w.id))
    }
    return words
  }

  const wordList = getWordList()

  const {
    currentQuestion,
    selectedAnswer,
    totalQuestions,
    score,
    isFinished,
    generateQuiz,
    answer,
    next,
    restart,
  } = useQuiz(wordList)

  const startQuiz = () => {
    if (wordList.length === 0) {
      alert(quizType === 'bookmarked' 
        ? 'You have no bookmarked words yet. Save some words first!' 
        : 'No words available.')
      return
    }
    generateQuiz(10)
    setQuizStarted(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Quiz selection screen
  if (!quizStarted) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight">Quiz</h2>
        <Card>
          <CardHeader>
            <CardTitle>Test Your Vocabulary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Choose a quiz type and test your knowledge.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant={quizType === 'random' ? 'default' : 'outline'}
                onClick={() => setQuizType('random')}
                className="flex-1 gap-2"
              >
                <Shuffle className="h-4 w-4" /> Random Words
              </Button>
              <Button
                variant={quizType === 'bookmarked' ? 'default' : 'outline'}
                onClick={() => setQuizType('bookmarked')}
                className="flex-1 gap-2"
                disabled={bookmarks.length === 0}
              >
                <Bookmark className="h-4 w-4" /> Bookmarked ({bookmarks.length})
              </Button>
            </div>
            {quizType === 'bookmarked' && bookmarks.length === 0 && (
              <p className="text-sm text-amber-500 dark:text-amber-400">
                No bookmarks yet. Go to Vocabulary and save some words.
              </p>
            )}
            <Button
              onClick={startQuiz}
              disabled={wordList.length === 0}
              className="w-full"
            >
              Start Quiz ({Math.min(10, wordList.length)} questions)
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Finished screen
  if (isFinished) {
    const percentage = Math.round((score / totalQuestions) * 100)
    let message = ''
    if (percentage === 100) message = '🌟 Perfect! You\'re a vocabulary master!'
    else if (percentage >= 70) message = '👏 Great job! Keep practicing.'
    else if (percentage >= 50) message = '💪 Good effort! Review the words you missed.'
    else message = '📖 Keep studying! You\'ll improve with practice.'

    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight">Quiz Complete!</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              {score} / {totalQuestions}
            </CardTitle>
            <p className="text-center text-muted-foreground">{message}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="w-full bg-muted rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={() => { setQuizStarted(false); restart(); }} variant="outline" className="flex-1">
                New Quiz
              </Button>
              <Button onClick={restart} className="flex-1">
                Retry Same Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Active quiz
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Quiz</h2>
        <span className="text-sm text-muted-foreground">
          Question {currentQuestion ? currentQuestion.index + 1 : 0} of {totalQuestions}
        </span>
      </div>
      {currentQuestion && (
        <QuizQuestion
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          onAnswer={answer}
          onNext={next}
          isLast={currentQuestion.index === totalQuestions - 1}
        />
      )}
    </div>
  )
}