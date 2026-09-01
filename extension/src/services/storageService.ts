import { ExtractedJobData, ApplicationStatus } from '../types';

export interface PendingJobSave {
  id: string;
  job: ExtractedJobData;
  status: ApplicationStatus;
  notes?: string;
  timestamp: string;
}

const AUTH_TOKEN_KEY = 'jobtrack_auth_token';
const PENDING_SAVES_KEY = 'jobtrack_pending_saves';
const USER_PREFS_KEY = 'jobtrack_user_preferences';

export const storageService = {
  async getAuthToken(): Promise<string | null> {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      const res = await chrome.storage.local.get(AUTH_TOKEN_KEY);
      return res[AUTH_TOKEN_KEY] || null;
    }
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  async setAuthToken(token: string): Promise<void> {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      await chrome.storage.local.set({ [AUTH_TOKEN_KEY]: token });
    } else {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
  },

  async clearAuthToken(): Promise<void> {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      await chrome.storage.local.remove(AUTH_TOKEN_KEY);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  },

  async getPendingJobs(): Promise<PendingJobSave[]> {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      const res = await chrome.storage.local.get(PENDING_SAVES_KEY);
      return res[PENDING_SAVES_KEY] || [];
    }
    const raw = localStorage.getItem(PENDING_SAVES_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  async addPendingJob(job: ExtractedJobData, status: ApplicationStatus, notes?: string): Promise<void> {
    const current = await this.getPendingJobs();
    const newEntry: PendingJobSave = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      job,
      status,
      notes,
      timestamp: new Date().toISOString(),
    };
    const updated = [newEntry, ...current.filter((item) => item.job.url !== job.url)];

    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      await chrome.storage.local.set({ [PENDING_SAVES_KEY]: updated });
    } else {
      localStorage.setItem(PENDING_SAVES_KEY, JSON.stringify(updated));
    }
  },

  async removePendingJob(id: string): Promise<void> {
    const current = await this.getPendingJobs();
    const updated = current.filter((item) => item.id !== id);
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      await chrome.storage.local.set({ [PENDING_SAVES_KEY]: updated });
    } else {
      localStorage.setItem(PENDING_SAVES_KEY, JSON.stringify(updated));
    }
  },

  async getPreferences(): Promise<Record<string, any>> {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      const res = await chrome.storage.local.get(USER_PREFS_KEY);
      return res[USER_PREFS_KEY] || {};
    }
    const raw = localStorage.getItem(USER_PREFS_KEY);
    return raw ? JSON.parse(raw) : {};
  },

  async setPreferences(prefs: Record<string, any>): Promise<void> {
    const current = await this.getPreferences();
    const updated = { ...current, ...prefs };
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      await chrome.storage.local.set({ [USER_PREFS_KEY]: updated });
    } else {
      localStorage.setItem(USER_PREFS_KEY, JSON.stringify(updated));
    }
  },
};
