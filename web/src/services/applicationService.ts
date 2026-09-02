import api from './api';
import {
  Application,
  ApplicationSummary,
  ApplicationStatus,
  ApiResponse,
  PageResponse,
  CreateApplicationPayload,
} from '../types';

export const applicationService = {
  async getApplications(params?: {
    search?: string;
    status?: ApplicationStatus;
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: string;
  }): Promise<PageResponse<Application>> {
    const res = await api.get<ApiResponse<PageResponse<Application>>>('/applications', { params });
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Failed to load applications');
    }
    return res.data.data;
  },

  async getApplicationById(id: number): Promise<Application> {
    const res = await api.get<ApiResponse<Application>>(`/applications/${id}`);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Application not found');
    }
    return res.data.data;
  },

  async createApplication(payload: CreateApplicationPayload): Promise<Application> {
    const res = await api.post<ApiResponse<Application>>('/applications', payload);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Failed to create application');
    }
    return res.data.data;
  },

  async updateStatus(id: number, status: ApplicationStatus): Promise<Application> {
    const res = await api.patch<ApiResponse<Application>>(`/applications/${id}/status`, { status });
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Failed to update status');
    }
    return res.data.data;
  },

  async updateApplication(
    id: number,
    data: { notes?: string; deadline?: string; followUpDate?: string; appliedDate?: string; status?: ApplicationStatus }
  ): Promise<Application> {
    const res = await api.put<ApiResponse<Application>>(`/applications/${id}`, data);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Failed to update application');
    }
    return res.data.data;
  },

  async deleteApplication(id: number): Promise<void> {
    await api.delete(`/applications/${id}`);
  },

  async getSummary(): Promise<ApplicationSummary> {
    const res = await api.get<ApiResponse<ApplicationSummary>>('/applications/summary');
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Failed to load summary');
    }
    return res.data.data;
  },
};
