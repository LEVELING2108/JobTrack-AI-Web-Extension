export type ApplicationStatus =
  | 'SAVED'
  | 'APPLIED'
  | 'SCREENING'
  | 'INTERVIEW'
  | 'OFFER'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'WITHDRAWN';

export type EmploymentType =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'CONTRACT'
  | 'INTERNSHIP'
  | 'TEMPORARY'
  | 'REMOTE'
  | 'OTHER';

export type ExperienceLevel =
  | 'ENTRY_LEVEL'
  | 'MID_LEVEL'
  | 'SENIOR_LEVEL'
  | 'LEAD'
  | 'DIRECTOR'
  | 'EXECUTIVE'
  | 'NOT_SPECIFIED';

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface ExtractedJobData {
  title: string;
  company: string;
  location?: string;
  url: string;
  description?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  employmentType?: EmploymentType;
  experienceLevel?: ExperienceLevel;
  source: string;
  sourceJobId?: string;
  postedDate?: string;
  extractedAt: string;
}

export interface JobExtractor {
  canHandle(url: string): boolean;
  extract(): Promise<ExtractedJobData | null> | ExtractedJobData | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp?: string;
}
