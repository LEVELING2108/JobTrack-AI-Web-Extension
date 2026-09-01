import { ExtractedJobData, JobExtractor, EmploymentType } from './types';
import { normalizeJobUrl } from '../../utils/urlNormalizer';

/**
 * Dedicated extractor for Indeed job postings and viewjob pages.
 */
export class IndeedExtractor implements JobExtractor {
  canHandle(url: string): boolean {
    return url.includes('indeed.com');
  }

  extract(): ExtractedJobData | null {
    try {
      // 1. Job Title
      const titleSelectors = [
        '[data-testid="jobsearch-JobInfoHeader-title"]',
        '.jobsearch-JobInfoHeader-title',
        'h1.jobsearch-JobInfoHeader-title-container',
        '.fastviewjob h1',
      ];
      const title = this.queryText(titleSelectors);

      // 2. Company Name
      const companySelectors = [
        '[data-testid="inlineHeader-companyName"]',
        '[data-testid="jobsearch-CompanyInfoContainer"] a',
        '.jobsearch-InlineCompanyRating-companyHeader',
        '.jobsearch-CompanyReview--heading',
      ];
      const company = this.queryText(companySelectors);

      if (!title || !company) {
        return null;
      }

      // 3. Location
      const locationSelectors = [
        '[data-testid="inlineHeader-companyLocation"]',
        '[data-testid="jobsearch-JobInfoHeader-companyLocation"]',
        '#jobLocationText',
      ];
      const location = this.queryText(locationSelectors);

      // 4. Job Description
      const description = this.queryText(['#jobDescriptionText', '.jobsearch-jobDescriptionText'], 4000);

      // 5. Salary range extraction if present
      let salaryMin: number | undefined;
      let salaryMax: number | undefined;
      let currency: string | undefined;

      const salaryText = this.queryText(['#salaryInfoAndJobType', '[data-testid="attribute_snippet_testid"]']);
      if (salaryText) {
        const numbers = salaryText.replace(/,/g, '').match(/\d+(?:\.\d+)?/g);
        if (numbers && numbers.length > 0) {
          salaryMin = parseFloat(numbers[0]);
          if (numbers.length > 1) {
            salaryMax = parseFloat(numbers[1]);
          }
        }
        if (salaryText.includes('$')) currency = 'USD';
        else if (salaryText.includes('£')) currency = 'GBP';
        else if (salaryText.includes('€')) currency = 'EUR';
        else if (salaryText.includes('₹')) currency = 'INR';
      }

      // 6. Employment type
      let employmentType: EmploymentType | undefined;
      if (salaryText.toLowerCase().includes('full-time')) employmentType = 'FULL_TIME';
      else if (salaryText.toLowerCase().includes('part-time')) employmentType = 'PART_TIME';
      else if (salaryText.toLowerCase().includes('contract')) employmentType = 'CONTRACT';

      const canonicalUrl = normalizeJobUrl(window.location.href);
      const jkMatch = window.location.href.match(/[?&]jk=([a-zA-Z0-9]+)/) || window.location.href.match(/[?&]vjk=([a-zA-Z0-9]+)/);
      const sourceJobId = jkMatch ? jkMatch[1] : undefined;

      return {
        title,
        company,
        location: location || undefined,
        url: canonicalUrl,
        description: description || undefined,
        salaryMin,
        salaryMax,
        currency,
        employmentType,
        source: 'INDEED',
        sourceJobId,
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
