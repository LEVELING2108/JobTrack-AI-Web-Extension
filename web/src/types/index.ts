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

export interface Job {
  id: number;
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
  createdAt: string;
}

export interface Application {
  id: number;
  userId: number;
  job: Job;
  status: ApplicationStatus;
  appliedDate?: string;
  deadline?: string;
  followUpDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
}
