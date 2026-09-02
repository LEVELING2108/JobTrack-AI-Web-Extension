import api from './api';
import { Reminder, ApiResponse, CreateReminderPayload } from '../types';

export const reminderService = {
  async getActiveReminders(): Promise<Reminder[]> {
    const res = await api.get<ApiResponse<Reminder[]>>('/reminders');
    return res.data.data || [];
  },

  async createReminder(payload: CreateReminderPayload): Promise<Reminder> {
    const res = await api.post<ApiResponse<Reminder>>('/reminders', payload);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Failed to create reminder');
    }
    return res.data.data;
  },

  async toggleReminder(id: number): Promise<Reminder> {
    const res = await api.patch<ApiResponse<Reminder>>(`/reminders/${id}/toggle`);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Failed to toggle reminder');
    }
    return res.data.data;
  },

  async deleteReminder(id: number): Promise<void> {
    await api.delete(`/reminders/${id}`);
  },
};
