import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { interviewService } from '../services/interviewService';
import { CreateInterviewPayload } from '../types';

export const useInterviewsQuery = () => {
  return useQuery({
    queryKey: ['interviews'],
    queryFn: () => interviewService.getInterviews(),
  });
};

export const useScheduleInterviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateInterviewPayload) => interviewService.scheduleInterview(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['applications-summary'] });
    },
  });
};

export const useDeleteInterviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => interviewService.deleteInterview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
};
