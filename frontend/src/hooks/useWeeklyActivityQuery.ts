import { useQuery } from '@tanstack/react-query';
import { getWeeklyActivity } from '@/services/activity';

export const useWeeklyActivityQuery = () => {
  return useQuery({
    queryKey: ['weeklyActivity'],
    queryFn: getWeeklyActivity,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};