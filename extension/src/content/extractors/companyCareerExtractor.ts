import { ExtractedJobData, JobExtractor } from './types';

/**
 * Extractor adapter for direct ATS & company career portals (Workday, Lever, Greenhouse, Ashby).
 */
export class CompanyCareerExtractor implements JobExtractor {
  canHandle(url: string): boolean {
    return (
      url.includes('greenhouse.io') ||
      url.includes('lever.co') ||
      url.includes('ashbyhq.com') ||
      url.includes('myworkdayjobs.com')
    );
  }

  extract(): ExtractedJobData | null {
    try {
      const title = document.querySelector('.app-title, .posting-headline h2, [data-automation-id="jobPostingHeader"], h1')?.textContent?.trim();
      const company = document.querySelector('.company-name, .posting-headline .org, [data-automation-id="companyName"]')?.textContent?.trim() || window.location.hostname;

      if (!title) {
        return null;
      }

      return {
        title,
        company,
        url: window.location.href,
        source: 'COMPANY_CAREER_PORTAL',
        extractedAt: new Date().toISOString(),
      };
    } catch {
      return null;
    }
  }
}
