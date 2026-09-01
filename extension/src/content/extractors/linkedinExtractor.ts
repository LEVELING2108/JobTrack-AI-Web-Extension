import { ExtractedJobData, JobExtractor, EmploymentType, ExperienceLevel } from './types';
import { normalizeJobUrl } from '../../utils/urlNormalizer';

/**
 * Dedicated extractor for LinkedIn job postings, supporting direct job view URLs
 * and collection/search view split panels.
 */
export class LinkedInExtractor implements JobExtractor {
  canHandle(url: string): boolean {
    return url.includes('linkedin.com/jobs');
  }

  extract(): ExtractedJobData | null {
    try {
      // 1. Job Title
      const titleSelectors = [
        '.job-details-jobs-unified-top-card__job-title',
        '.jobs-unified-top-card__job-title',
        '.topcard__title',
        'h1.top-card-layout__title',
        '.jobs-details__main-content h1',
      ];
      let title = this.queryText(titleSelectors);

      // 2. Company Name
      const companySelectors = [
        '.job-details-jobs-unified-top-card__company-name',
        '.jobs-unified-top-card__company-name a',
        '.jobs-unified-top-card__company-name',
        '.topcard__org-name-link',
        'a.topcard__org-name-link',
        '.top-card-layout__first-subline a',
      ];
      let company = this.queryText(companySelectors);

      if (!title || !company) {
        return null;
      }

      // 3. Location
      const locationSelectors = [
        '.job-details-jobs-unified-top-card__primary-description-container span.tvm__text',
        '.jobs-unified-top-card__bullet',
        '.topcard__flavor--bullet',
        '.top-card-layout__first-subline .topcard__flavor:nth-child(2)',
      ];
      const location = this.queryText(locationSelectors);

      // 4. Job Description
      const descriptionSelectors = [
        '#job-details',
        '.jobs-description__content',
        '.jobs-box__htmlContent',
        '.show-more-less-html__markup',
      ];
      const description = this.queryText(descriptionSelectors, 4000);

      // 5. Work Type & Experience Level from job criteria pills
      let employmentType: EmploymentType | undefined;
      let experienceLevel: ExperienceLevel | undefined;

      const criteriaItems = document.querySelectorAll('.description__job-criteria-item, .job-details-jobs-unified-top-card__job-insight');
      criteriaItems.forEach((el) => {
        const text = (el.textContent || '').toLowerCase();
        if (text.includes('full-time')) employmentType = 'FULL_TIME';
        else if (text.includes('part-time')) employmentType = 'PART_TIME';
        else if (text.includes('contract')) employmentType = 'CONTRACT';
        else if (text.includes('internship')) employmentType = 'INTERNSHIP';

        if (text.includes('entry level') || text.includes('associate')) experienceLevel = 'ENTRY_LEVEL';
        else if (text.includes('mid-senior') || text.includes('mid level')) experienceLevel = 'MID_LEVEL';
        else if (text.includes('director')) experienceLevel = 'DIRECTOR';
        else if (text.includes('executive')) experienceLevel = 'EXECUTIVE';
      });

      // 6. Source Job ID
      const canonicalUrl = normalizeJobUrl(window.location.href);
      const jobIdMatch = window.location.href.match(/currentJobId=(\d+)/) || window.location.pathname.match(/\/view\/(\d+)/);
      const sourceJobId = jobIdMatch ? jobIdMatch[1] : undefined;

      return {
        title,
        company,
        location: location || undefined,
        url: canonicalUrl,
        description: description || undefined,
        employmentType,
        experienceLevel,
        source: 'LINKEDIN',
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
