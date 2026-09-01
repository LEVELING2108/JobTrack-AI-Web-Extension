import { ExtractedJobData, JobExtractor } from './types';

/**
 * Fallback generic extractor relying on JSON-LD structured data, Open Graph tags, and standard metadata.
 */
export class GenericExtractor implements JobExtractor {
  canHandle(_url: string): boolean {
    return true; // Catch-all fallback
  }

  extract(): ExtractedJobData | null {
    try {
      // 1. Try extracting from JSON-LD Schema.org/JobPosting
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      for (const script of Array.from(scripts)) {
        try {
          const json = JSON.parse(script.textContent || '{}');
          const jobPosting = json['@type'] === 'JobPosting' ? json : Array.isArray(json['@graph']) ? json['@graph'].find((i: any) => i['@type'] === 'JobPosting') : null;
          
          if (jobPosting && jobPosting.title) {
            return {
              title: jobPosting.title,
              company: typeof jobPosting.hiringOrganization === 'object' ? jobPosting.hiringOrganization.name : (jobPosting.hiringOrganization || 'Unknown Company'),
              location: typeof jobPosting.jobLocation === 'object' ? (jobPosting.jobLocation.address?.addressLocality || 'Remote/Unspecified') : 'Remote/Unspecified',
              url: window.location.href,
              description: jobPosting.description ? jobPosting.description.substring(0, 3000) : '',
              source: 'GENERIC_JSON_LD',
              extractedAt: new Date().toISOString(),
            };
          }
        } catch {
          // Ignore JSON parse errors and continue
        }
      }

      // 2. OpenGraph Fallback
      const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
      const ogSiteName = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content');

      if (ogTitle) {
        return {
          title: ogTitle,
          company: ogSiteName || 'Unknown Company',
          url: window.location.href,
          source: 'GENERIC_OG_TAGS',
          extractedAt: new Date().toISOString(),
        };
      }

      // 3. Fallback to Document Title
      if (document.title) {
        return {
          title: document.title,
          company: window.location.hostname,
          url: window.location.href,
          source: 'GENERIC_PAGE_TITLE',
          extractedAt: new Date().toISOString(),
        };
      }

      return null;
    } catch {
      return null;
    }
  }
}
