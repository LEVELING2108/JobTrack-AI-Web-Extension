import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService } from '../services/applicationService';
import { ApplicationStatus, CreateApplicationPayload } from '../types';

export const useApplicationsQuery = (params?: {
  search?: string;
  status?: ApplicationStatus;
  page?: number;
  size?: number;
}) => {
  return useQuery({
    queryKey: ['applications', params],
    queryFn: () => applicationService.getApplications(params),
  });
};

export const useApplicationSummaryQuery = () => {
  return useQuery({
    queryKey: ['applications-summary'],
    queryFn: () => applicationService.getSummary(),
  });
};

export const useUpdateStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: ApplicationStatus }) =>
      applicationService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['applications-summary'] });
    },
  });
};

export const useCreateApplicationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateApplicationPayload) => applicationService.createApplication(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['applications-summary'] });
    },
  });
};

export const useUpdateApplicationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { notes?: string; deadline?: string; followUpDate?: string; appliedDate?: string; status?: ApplicationStatus };
    }) => applicationService.updateApplication(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['applications-summary'] });
    },
  });
};

export const useDeleteApplicationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => applicationService.deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['applications-summary'] });
    },
  });
};
