import { useState, useEffect } from 'react';
import { getBookmarks, addBookmark, removeBookmark } from '@/services/bookmarks';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookmarks()
      .then((data) => setBookmarks(data))
      .finally(() => setLoading(false));
  }, []);

  const toggleBookmark = async (wordId: number) => {
    const isBookmarked = bookmarks.includes(wordId);
    if (isBookmarked) {
      const updated = await removeBookmark(wordId);
      setBookmarks(updated);
    } else {
      const updated = await addBookmark(wordId);
      setBookmarks(updated);
    }
  };

  const isBookmarked = (wordId: number) => bookmarks.includes(wordId);

  return { bookmarks, loading, toggleBookmark, isBookmarked };
};