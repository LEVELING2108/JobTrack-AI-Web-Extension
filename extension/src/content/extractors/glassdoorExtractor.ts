import { ExtractedJobData, JobExtractor } from './types';

/**
 * Dedicated extractor for Glassdoor job postings.
 */
export class GlassdoorExtractor implements JobExtractor {
  canHandle(url: string): boolean {
    return url.includes('glassdoor.com');
  }

  extract(): ExtractedJobData | null {
    try {
      const title = document.querySelector('.JobDetails_jobTitle__Rw5m5, [data-test="job-title"]')?.textContent?.trim();
      const company = document.querySelector('.EmployerProfile_employerName__ZdBFt, [data-test="employer-name"]')?.textContent?.trim();
      const location = document.querySelector('.JobDetails_location__mSg5h, [data-test="location"]')?.textContent?.trim();

      if (!title || !company) {
        return null;
      }

      return {
        title,
        company,
        location: location || undefined,
        url: window.location.href,
        source: 'GLASSDOOR',
        extractedAt: new Date().toISOString(),
      };
    } catch {
      return null;
    }
  }
}
