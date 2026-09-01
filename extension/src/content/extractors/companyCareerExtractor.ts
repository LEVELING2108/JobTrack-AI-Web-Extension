import { ExtractedJobData, JobExtractor } from './types';
import { normalizeJobUrl } from '../../utils/urlNormalizer';

/**
 * Adapter for popular ATS platforms and direct company career pages:
 * Greenhouse, Lever, Ashby, Workday, SmartRecruiters, and BambooHR.
 */
export class CompanyCareerExtractor implements JobExtractor {
  canHandle(url: string): boolean {
    return (
      url.includes('greenhouse.io') ||
      url.includes('lever.co') ||
      url.includes('ashbyhq.com') ||
      url.includes('myworkdayjobs.com') ||
      url.includes('smartrecruiters.com') ||
      url.includes('bamboohr.com')
    );
  }

  extract(): ExtractedJobData | null {
    try {
      const url = window.location.href;
      let title = '';
      let company = '';
      let location = '';
      let description = '';

      if (url.includes('greenhouse.io')) {
        title = this.queryText(['.app-title', '#header h1', 'h1.job-title']);
        company = this.queryText(['.company-name', '#header .company-name']);
        location = this.queryText(['.location', '#header .location']);
        description = this.queryText(['#content', '#job-description'], 4000);
      } else if (url.includes('lever.co')) {
        title = this.queryText(['.posting-headline h2', 'h2.posting-title']);
        company = this.queryText(['.posting-headline .org', '.main-header-logo img[alt]']);
        location = this.queryText(['.posting-categories .location', '.sort-by-time.posting-category']);
        description = this.queryText(['.section-wrapper.page-full-width', '.content'], 4000);
      } else if (url.includes('ashbyhq.com')) {
        title = this.queryText(['h1._jobTitle_1r3z1_1', 'h1']);
        company = this.queryText(['._companyName_1r3z1_1', 'nav span']);
        location = this.queryText(['._jobMeta_1r3z1_1', '._location_1r3z1_1']);
        description = this.queryText(['._description_1r3z1_1', '.job-description'], 4000);
      } else if (url.includes('myworkdayjobs.com')) {
        title = this.queryText(['[data-automation-id="jobPostingHeader"]', 'h2[data-automation-id="jobPostingTitle"]']);
        company = this.queryText(['[data-automation-id="companyName"]']) || window.location.hostname.split('.')[0];
        location = this.queryText(['[data-automation-id="locations"]', '[data-automation-id="jobPostingLocation"]']);
        description = this.queryText(['[data-automation-id="jobPostingDescription"]'], 4000);
      } else {
        title = this.queryText(['h1', '.job-title', '[class*="job-title"]']);
        company = this.queryText(['.company-name', '[class*="company"]']) || window.location.hostname;
        location = this.queryText(['.job-location', '[class*="location"]']);
        description = this.queryText(['.job-description', '[class*="description"]'], 4000);
      }

      if (!title) {
        return null;
      }

      return {
        title,
        company: company || window.location.hostname,
        location: location || undefined,
        url: normalizeJobUrl(url),
        description: description || undefined,
        source: 'COMPANY_CAREER_PORTAL',
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
