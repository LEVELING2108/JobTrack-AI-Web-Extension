import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analyticsService';

export const useAnalyticsOverviewQuery = () => {
  return useQuery({
    queryKey: ['analytics-overview'],
    queryFn: () => analyticsService.getOverview(),
  });
};
