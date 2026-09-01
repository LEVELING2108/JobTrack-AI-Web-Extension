import { ExtractedJobData, JobExtractor } from './types';

/**
 * Dedicated extractor for Indeed job postings.
 */
export class IndeedExtractor implements JobExtractor {
  canHandle(url: string): boolean {
    return url.includes('indeed.com');
  }

  extract(): ExtractedJobData | null {
    try {
      const title = document.querySelector('[data-testid="jobsearch-JobInfoHeader-title"], .jobsearch-JobInfoHeader-title')?.textContent?.trim();
      const company = document.querySelector('[data-testid="inlineHeader-companyName"], [data-testid="jobsearch-CompanyInfoContainer"] a')?.textContent?.trim();
      const location = document.querySelector('[data-testid="inlineHeader-companyLocation"], [data-testid="jobsearch-JobInfoHeader-companyLocation"]')?.textContent?.trim();
      const description = document.querySelector('#jobDescriptionText')?.textContent?.trim();

      if (!title || !company) {
        return null;
      }

      return {
        title,
        company,
        location: location || undefined,
        url: window.location.href,
        description: description ? description.substring(0, 3000) : undefined,
        source: 'INDEED',
        extractedAt: new Date().toISOString(),
      };
    } catch {
      return null;
    }
  }
}
