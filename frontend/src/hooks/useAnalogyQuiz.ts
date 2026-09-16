import { useState } from 'react';
import { Vocabulary } from '@/types';

export type AnalogyQuestion = {
  word1: Vocabulary;
  meaning1: string; // shortened
  word2: Vocabulary;
  options: string[];
  correctMeaning: string;
  index: number;
};

// Helper to get a concise meaning (first part before ; / ,)
const getConciseMeaning = (meaning: string): string => {
  // Split by common delimiters and take the first non-empty part
  const parts = meaning.split(/[;/,]/).map(s => s.trim()).filter(s => s.length > 0);
  return parts.length > 0 ? parts[0] : meaning;
};

export function useAnalogyQuiz(words: Vocabulary[]) {
  const [questions, setQuestions] = useState<AnalogyQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const generateQuiz = (numQuestions: number = 10) => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(numQuestions * 2, shuffled.length));

    const pairs: [Vocabulary, Vocabulary][] = [];
    for (let i = 0; i < selected.length - 1; i += 2) {
      pairs.push([selected[i], selected[i + 1]]);
    }

    const qs: AnalogyQuestion[] = pairs.map(([w1, w2], idx) => {
      // Get concise meaning for word1
      const conciseMeaning1 = getConciseMeaning(w1.englishMeaning);

      // Get 3 wrong meanings from other words (excluding w2's meaning)
      const otherMeanings = words
        .filter(w => w.id !== w2.id)
        .map(w => w.englishMeaning);
      const shuffledMeanings = otherMeanings.sort(() => Math.random() - 0.5);
      const wrongOptions = shuffledMeanings.slice(0, 3);
      const options = [w2.englishMeaning, ...wrongOptions];
      const shuffledOptions = options.sort(() => Math.random() - 0.5);

      return {
        word1: w1,
        meaning1: conciseMeaning1, // short version
        word2: w2,
        options: shuffledOptions,
        correctMeaning: w2.englishMeaning,
        index: idx,
      };
    });

    setQuestions(qs.slice(0, numQuestions));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsFinished(false);
  };

  const answer = (option: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(option);
    if (option === questions[currentIndex]?.correctMeaning) {
      setScore(prev => prev + 1);
    }
  };

  const next = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
    }
  };

  const restart = () => {
    generateQuiz(10);
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
    generateQuiz,
    answer,
    next,
    restart,
  };
}