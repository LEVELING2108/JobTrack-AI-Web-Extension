import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reminderService } from '../services/reminderService';
import { CreateReminderPayload } from '../types';

export const useRemindersQuery = () => {
  return useQuery({
    queryKey: ['reminders'],
    queryFn: () => reminderService.getActiveReminders(),
  });
};

export const useCreateReminderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReminderPayload) => reminderService.createReminder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });
};

export const useToggleReminderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reminderService.toggleReminder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });
};

export const useDeleteReminderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reminderService.deleteReminder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });
};
