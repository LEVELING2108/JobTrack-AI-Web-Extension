import { ExtractedJobData, JobExtractor, EmploymentType } from './types';
import { normalizeJobUrl } from '../../utils/urlNormalizer';

/**
 * Universal fallback extractor prioritizing:
 * 1. Schema.org JobPosting JSON-LD structured metadata
 * 2. OpenGraph & Twitter card metadata
 * 3. Microdata / semantic HTML tags
 * 4. Document title & headings heuristics
 */
export class GenericExtractor implements JobExtractor {
  canHandle(_url: string): boolean {
    return true; // Universal fallback
  }

  extract(): ExtractedJobData | null {
    try {
      // 1. Structured Data: Schema.org/JobPosting in JSON-LD
      const jsonLdResult = this.extractFromJsonLd();
      if (jsonLdResult) {
        return jsonLdResult;
      }

      // 2. Open Graph & Meta tags
      const metaResult = this.extractFromMetaTags();
      if (metaResult) {
        return metaResult;
      }

      // 3. Semantic DOM Heuristics
      const domResult = this.extractFromDomHeuristics();
      if (domResult) {
        return domResult;
      }

      // 4. Basic fallback using document title
      if (document.title && document.title.length > 3) {
        return {
          title: document.title.split(/[-–|]/)[0].trim(),
          company: window.location.hostname.replace('www.', ''),
          url: normalizeJobUrl(window.location.href),
          source: 'GENERIC_FALLBACK',
          extractedAt: new Date().toISOString(),
        };
      }

      return null;
    } catch {
      return null;
    }
  }

  private extractFromJsonLd(): ExtractedJobData | null {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (const script of Array.from(scripts)) {
      try {
        const rawText = script.textContent?.trim();
        if (!rawText) continue;

        const data = JSON.parse(rawText);
        let job = null;

        if (data['@type'] === 'JobPosting') {
          job = data;
        } else if (Array.isArray(data['@graph'])) {
          job = data['@graph'].find((item: any) => item['@type'] === 'JobPosting');
        } else if (Array.isArray(data)) {
          job = data.find((item: any) => item['@type'] === 'JobPosting');
        }

        if (job && job.title) {
          let company = 'Unknown Company';
          if (typeof job.hiringOrganization === 'object' && job.hiringOrganization !== null) {
            company = job.hiringOrganization.name || company;
          } else if (typeof job.hiringOrganization === 'string') {
            company = job.hiringOrganization;
          }

          let location = undefined;
          if (job.jobLocation) {
            if (typeof job.jobLocation === 'object' && job.jobLocation.address) {
              const addr = job.jobLocation.address;
              location = typeof addr === 'string' ? addr : [addr.addressLocality, addr.addressRegion, addr.addressCountry].filter(Boolean).join(', ');
            }
          }

          let salaryMin = undefined;
          let salaryMax = undefined;
          let currency = undefined;
          if (job.baseSalary) {
            currency = job.baseSalary.currency;
            if (typeof job.baseSalary.value === 'object') {
              salaryMin = job.baseSalary.value.minValue || job.baseSalary.value.value;
              salaryMax = job.baseSalary.value.maxValue;
            } else if (typeof job.baseSalary.value === 'number') {
              salaryMin = job.baseSalary.value;
            }
          }

          let employmentType: EmploymentType | undefined;
          if (typeof job.employmentType === 'string') {
            const et = job.employmentType.toUpperCase();
            if (et.includes('FULL_TIME')) employmentType = 'FULL_TIME';
            else if (et.includes('PART_TIME')) employmentType = 'PART_TIME';
            else if (et.includes('CONTRACT')) employmentType = 'CONTRACT';
            else if (et.includes('INTERN')) employmentType = 'INTERNSHIP';
          }

          return {
            title: job.title.trim(),
            company: company.trim(),
            location,
            url: normalizeJobUrl(window.location.href),
            description: typeof job.description === 'string' ? this.stripHtml(job.description).substring(0, 4000) : undefined,
            salaryMin,
            salaryMax,
            currency,
            employmentType,
            postedDate: job.datePosted,
            source: 'STRUCTURED_JSON_LD',
            extractedAt: new Date().toISOString(),
          };
        }
      } catch {
        // Continue to next script
      }
    }
    return null;
  }

  private extractFromMetaTags(): ExtractedJobData | null {
    const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
    const ogSite = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content');
    const ogDesc = document.querySelector('meta[property="og:description"]')?.getAttribute('content');

    if (ogTitle && ogTitle.toLowerCase().includes('job') || ogTitle && ogTitle.toLowerCase().includes('engineer') || ogTitle && ogTitle.toLowerCase().includes('developer')) {
      return {
        title: ogTitle.trim(),
        company: ogSite?.trim() || window.location.hostname.replace('www.', ''),
        url: normalizeJobUrl(window.location.href),
        description: ogDesc?.trim().substring(0, 4000),
        source: 'OPEN_GRAPH_META',
        extractedAt: new Date().toISOString(),
      };
    }
    return null;
  }

  private extractFromDomHeuristics(): ExtractedJobData | null {
    const h1 = document.querySelector('h1');
    if (!h1 || !h1.textContent) return null;

    const titleText = h1.textContent.trim();
    if (titleText.length < 3 || titleText.length > 150) return null;

    const companyEl = document.querySelector('[class*="company" i], [class*="employer" i], [class*="org-name" i]');
    const company = companyEl?.textContent?.trim() || window.location.hostname.replace('www.', '');

    return {
      title: titleText,
      company,
      url: normalizeJobUrl(window.location.href),
      source: 'SEMANTIC_DOM_HEURISTIC',
      extractedAt: new Date().toISOString(),
    };
  }

  private stripHtml(html: string): string {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }
}
