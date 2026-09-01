import { ExtractedJobData, JobExtractor } from './types';

/**
 * Dedicated extractor for LinkedIn job postings and job view pages.
 */
export class LinkedInExtractor implements JobExtractor {
  canHandle(url: string): boolean {
    return url.includes('linkedin.com/jobs');
  }

  extract(): ExtractedJobData | null {
    try {
      const title = document.querySelector('.job-details-jobs-unified-top-card__job-title, .jobs-unified-top-card__job-title, .topcard__title')?.textContent?.trim();
      const company = document.querySelector('.job-details-jobs-unified-top-card__company-name, .jobs-unified-top-card__company-name, .topcard__org-name-link')?.textContent?.trim();
      const location = document.querySelector('.job-details-jobs-unified-top-card__bullet, .jobs-unified-top-card__bullet, .topcard__flavor--bullet')?.textContent?.trim();
      const description = document.querySelector('.jobs-description__content, .jobs-box__htmlContent, #job-details')?.textContent?.trim();

      if (!title || !company) {
        return null;
      }

      return {
        title,
        company,
        location: location || undefined,
        url: window.location.href,
        description: description ? description.substring(0, 3000) : undefined,
        source: 'LINKEDIN',
        extractedAt: new Date().toISOString(),
      };
    } catch {
      return null;
    }
  }
}
