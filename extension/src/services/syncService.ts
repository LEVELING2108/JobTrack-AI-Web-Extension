import { storageService } from './storageService';
import { apiService } from './apiService';

export interface SyncResult {
  syncedCount: number;
  duplicateCount: number;
  failedCount: number;
}

export const syncService = {
  async syncPendingJobs(): Promise<SyncResult> {
    const pending = await storageService.getPendingJobs();
    if (pending.length === 0) {
      return { syncedCount: 0, duplicateCount: 0, failedCount: 0 };
    }

    const token = await storageService.getAuthToken();
    if (!token) {
      return { syncedCount: 0, duplicateCount: 0, failedCount: pending.length };
    }

    let synced = 0;
    let duplicates = 0;
    let failed = 0;

    for (const item of pending) {
      const res = await apiService.saveApplication(item.job, item.status, item.notes);
      if (res.success) {
        synced++;
        await storageService.removePendingJob(item.id);
      } else if (res.isDuplicate) {
        duplicates++;
        // Remove duplicate from pending queue since it already exists on backend
        await storageService.removePendingJob(item.id);
      } else {
        failed++;
      }
    }

    return {
      syncedCount: synced,
      duplicateCount: duplicates,
      failedCount: failed,
    };
  },
};
