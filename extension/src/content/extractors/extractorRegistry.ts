import { ExtractedJobData, JobExtractor } from './types';
import { LinkedInExtractor } from './linkedinExtractor';
import { IndeedExtractor } from './indeedExtractor';
import { GlassdoorExtractor } from './glassdoorExtractor';
import { CompanyCareerExtractor } from './companyCareerExtractor';
import { GenericExtractor } from './genericExtractor';

export class ExtractorRegistry {
  private extractors: JobExtractor[] = [
    new LinkedInExtractor(),
    new IndeedExtractor(),
    new GlassdoorExtractor(),
    new CompanyCareerExtractor(),
    new GenericExtractor(),
  ];

  public async extractCurrentPage(): Promise<ExtractedJobData | null> {
    const currentUrl = window.location.href;

    for (const extractor of this.extractors) {
      if (extractor.canHandle(currentUrl)) {
        const result = await extractor.extract();
        if (result && result.title) {
          return result;
        }
      }
    }

    return null;
  }
}

export const extractorRegistry = new ExtractorRegistry();
