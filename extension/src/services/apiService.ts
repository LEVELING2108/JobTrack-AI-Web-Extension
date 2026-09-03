import { ExtractedJobData, ApplicationStatus, ApiResponse, User } from '../types';
import { storageService } from './storageService';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export interface AuthSuccessPayload {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface SaveApplicationResult {
  success: boolean;
  isDuplicate?: boolean;
  data?: any;
  error?: string;
}

export const apiService = {
  async loginWithGoogle(
    idToken: string,
    email?: string,
    name?: string
  ): Promise<ApiResponse<AuthSuccessPayload>> {
    const res = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken, email, name }),
    });

    const data: ApiResponse<AuthSuccessPayload> = await res.json();
    if (res.ok && data.data?.accessToken) {
      await storageService.setAuthToken(data.data.accessToken);
      await storageService.setPreferences({ user: data.data.user });
    }
    return data;
  },

  async login(email: string, password: string): Promise<ApiResponse<AuthSuccessPayload>> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });

    const data: ApiResponse<AuthSuccessPayload> = await res.json();
    if (res.ok && data.data?.accessToken) {
      await storageService.setAuthToken(data.data.accessToken);
      await storageService.setPreferences({ user: data.data.user });
    }
    return data;
  },

  async register(name: string, email: string, password: string): Promise<ApiResponse<AuthSuccessPayload>> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password }),
    });

    const data: ApiResponse<AuthSuccessPayload> = await res.json();
    if (res.ok && data.data?.accessToken) {
      await storageService.setAuthToken(data.data.accessToken);
      await storageService.setPreferences({ user: data.data.user });
    }
    return data;
  },

  async getCurrentUser(): Promise<User | null> {
    const token = await storageService.getAuthToken();
    if (!token) return null;

    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 401) {
        await storageService.clearAuthToken();
        return null;
      }

      const data: ApiResponse<User> = await res.json();
      return data.success && data.data ? data.data : null;
    } catch {
      return null;
    }
  },

  async saveApplication(
    job: ExtractedJobData,
    status: ApplicationStatus = 'SAVED',
    notes?: string
  ): Promise<SaveApplicationResult> {
    const token = await storageService.getAuthToken();
    if (!token) {
      return { success: false, error: 'NOT_AUTHENTICATED' };
    }

    try {
      const payload = {
        job: {
          title: job.title,
          company: job.company,
          location: job.location,
          url: job.url,
          description: job.description,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          currency: job.currency || 'USD',
          employmentType: job.employmentType,
          experienceLevel: job.experienceLevel,
          source: job.source,
          sourceJobId: job.sourceJobId,
          postedDate: job.postedDate,
        },
        status,
        notes,
      };

      const res = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const body = await res.json();

      if (res.status === 409) {
        return {
          success: false,
          isDuplicate: true,
          error: 'This job is already in your applications pipeline.',
        };
      }

      if (!res.ok) {
        return {
          success: false,
          error: body.error?.message || 'Failed to save application.',
        };
      }

      return {
        success: true,
        data: body.data,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Network error connecting to JobTrack API.',
      };
    }
  },

  async calculateMatchScore(
    jobTitle: string,
    company: string,
    jobDescription: string
  ): Promise<{ matchScore: number; summary: string; matchingSkills: string[]; missingSkills: string[] } | null> {
    const token = await storageService.getAuthToken();
    if (!token) return null;

    try {
      const res = await fetch(`${API_BASE_URL}/ai/match-score`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobTitle, company, jobDescription }),
      });

      const data = await res.json();
      return data.success && data.data ? data.data : null;
    } catch {
      return null;
    }
  },
};
