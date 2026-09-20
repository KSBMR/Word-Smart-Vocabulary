import { useState, useEffect, useMemo } from 'react';
import { AnalogyQuestion } from '@/types';
import { loadAnalogyQuestions } from '@/services/AnalogyService';

export function useAnalogyQuestions() {
  const [allQuestions, setAllQuestions] = useState<AnalogyQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAnalogyQuestions().then((data) => {
      setAllQuestions(data);
      setLoading(false);
    });
  }, []);

  const filteredQuestions = useMemo(() => {
    if (!searchQuery.trim()) return allQuestions;
    const q = searchQuery.trim().toLowerCase();

    return allQuestions.filter((item) => {
      if (item.question.toLowerCase().includes(q)) return true;
      if (item.explanation.toLowerCase().includes(q)) return true;
      return Object.values(item.options).some((opt) =>
        opt.toLowerCase().includes(q)
      );
    });
  }, [allQuestions, searchQuery]);

  return {
    questions: filteredQuestions,
    totalCount: allQuestions.length,
    filteredCount: filteredQuestions.length,
    loading,
    searchQuery,
    setSearchQuery,
  };
}