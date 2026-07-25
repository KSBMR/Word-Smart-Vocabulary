import { useState } from 'react'
import { Vocabulary } from '@/types'

export type QuizQuestion = {
  word: Vocabulary
  options: string[]
  correctAnswer: string
  index: number // add this
}

export function useQuiz(words: Vocabulary[]) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])

  const generateQuiz = (numQuestions: number = 10) => {
    const shuffled = [...words].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, Math.min(numQuestions, shuffled.length))

    const qs: QuizQuestion[] = selected.map((word, idx) => {
      // Get 3 wrong answers from other words
      const otherMeanings = words
        .filter(w => w.id !== word.id)
        .map(w => w.englishMeaning)
      const shuffledMeanings = otherMeanings.sort(() => Math.random() - 0.5)
      const wrongOptions = shuffledMeanings.slice(0, 3)
      const options = [word.englishMeaning, ...wrongOptions]
      // Shuffle options
      const shuffledOptions = options.sort(() => Math.random() - 0.5)
      return {
        word,
        options: shuffledOptions,
        correctAnswer: word.englishMeaning,
        index: idx, // set index
      }
    })

    setQuestions(qs)
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setScore(0)
    setIsFinished(false)
  }

  const answer = (option: string) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(option)
    if (option === questions[currentIndex]?.correctAnswer) {
      setScore(prev => prev + 1)
    }
  }

  const next = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setSelectedAnswer(null)
    } else {
      setIsFinished(true)
    }
  }

  const restart = () => {
    generateQuiz(10)
  }

  const currentQuestion = questions[currentIndex]

  return {
    questions,
    currentQuestion,
    currentIndex,
    totalQuestions: questions.length,
    selectedAnswer,
    score,
    isFinished,
    generateQuiz,
    answer,
    next,
    restart,
  }
}