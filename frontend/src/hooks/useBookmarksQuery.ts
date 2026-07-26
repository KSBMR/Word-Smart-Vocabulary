import { useQuery } from '@tanstack/react-query';
import { getBookmarks } from '@/services/bookmarks';

export const useBookmarksQuery = () => {
  return useQuery({
    queryKey: ['bookmarks'],
    queryFn: getBookmarks,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};