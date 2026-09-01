import { ExtractedJobData, JobExtractor } from './types';
import { normalizeJobUrl } from '../../utils/urlNormalizer';

/**
 * Dedicated extractor for Glassdoor job postings.
 */
export class GlassdoorExtractor implements JobExtractor {
  canHandle(url: string): boolean {
    return url.includes('glassdoor.com');
  }

  extract(): ExtractedJobData | null {
    try {
      const titleSelectors = [
        '.JobDetails_jobTitle__Rw5m5',
        '[data-test="job-title"]',
        'h1.heading_Heading__6qRt5',
        '.job-title',
      ];
      const title = this.queryText(titleSelectors);

      const companySelectors = [
        '.EmployerProfile_employerName__ZdBFt',
        '[data-test="employer-name"]',
        '.employer-name',
        '.job-search-key-16z3s6e',
      ];
      const company = this.queryText(companySelectors);

      if (!title || !company) {
        return null;
      }

      const location = this.queryText([
        '.JobDetails_location__mSg5h',
        '[data-test="location"]',
        '.location',
      ]);

      const description = this.queryText(['.JobDetails_jobDescription__uWgah', '#JobDescriptionContainer'], 4000);

      return {
        title,
        company,
        location: location || undefined,
        url: normalizeJobUrl(window.location.href),
        description: description || undefined,
        source: 'GLASSDOOR',
        extractedAt: new Date().toISOString(),
      };
    } catch {
      return null;
    }
  }

  private queryText(selectors: string[], maxLength?: number): string {
    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el && el.textContent) {
        const cleaned = el.textContent.trim().replace(/\s+/g, ' ');
        return maxLength ? cleaned.substring(0, maxLength) : cleaned;
      }
    }
    return '';
  }
}
