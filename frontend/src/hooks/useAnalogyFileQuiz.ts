import { useState } from 'react';
import { AnalogyQuestion } from '@/types';

export type AnalogyFileQuizItem = {
  question: AnalogyQuestion;
  index: number;
};

export function useAnalogyFileQuiz(allQuestions: AnalogyQuestion[]) {
  const [questions, setQuestions] = useState<AnalogyFileQuizItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [wrongList, setWrongList] = useState<number[]>([]);

  const generateQuiz = (numQuestions: number = 10) => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(
      0,
      Math.min(numQuestions, shuffled.length)
    );

    const qs: AnalogyFileQuizItem[] = selected.map((q, idx) => ({
      question: q,
      index: idx,
    }));

    setQuestions(qs);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setWrongList([]);
    setIsFinished(false);
  };

  const answer = (optionKey: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optionKey);

    const current = questions[currentIndex];
    if (!current) return;

    if (optionKey === current.question.answer) {
      setScore((prev) => prev + 1);
    } else {
      setWrongList((prev) => [...prev, current.question.sl]);
    }
  };

  const next = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
    }
  };

  const restart = () => {
    generateQuiz(questions.length || 10);
  };

  const currentQuestion = questions[currentIndex];

  return {
    questions,
    currentQuestion,
    currentIndex,
    totalQuestions: questions.length,
    selectedAnswer,
    score,
    isFinished,
    wrongList,
    generateQuiz,
    answer,
    next,
    restart,
  };
}