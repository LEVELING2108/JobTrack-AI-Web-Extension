import api from './api';
import { Interview, ApiResponse, CreateInterviewPayload } from '../types';

export const interviewService = {
  async getInterviews(): Promise<Interview[]> {
    const res = await api.get<ApiResponse<Interview[]>>('/interviews');
    return res.data.data || [];
  },

  async scheduleInterview(payload: CreateInterviewPayload): Promise<Interview> {
    const res = await api.post<ApiResponse<Interview>>('/interviews', payload);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Failed to schedule interview');
    }
    return res.data.data;
  },

  async deleteInterview(id: number): Promise<void> {
    await api.delete(`/interviews/${id}`);
  },
};
