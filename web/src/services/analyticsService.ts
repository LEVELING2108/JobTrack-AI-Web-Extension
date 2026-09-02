import api from './api';
import { AnalyticsOverview, ApiResponse } from '../types';

export const analyticsService = {
  async getOverview(): Promise<AnalyticsOverview> {
    const res = await api.get<ApiResponse<AnalyticsOverview>>('/analytics/overview');
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Failed to fetch analytics');
    }
    return res.data.data;
  },
};
