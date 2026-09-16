import { useQuery } from '@tanstack/react-query';
import { getProfile } from '@/services/auth';

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};