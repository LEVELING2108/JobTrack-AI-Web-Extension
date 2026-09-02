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

export type JobSource =
  | 'LINKEDIN'
  | 'INDEED'
  | 'GLASSDOOR'
  | 'COMPANY_WEBSITE'
  | 'GENERIC'
  | 'OTHER';

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
  source: JobSource | string;
  sourceJobId?: string;
  postedDate?: string;
  createdAt: string;
}

export interface Interview {
  id: number;
  applicationId: number;
  roundName: string;
  scheduledAt: string;
  interviewer?: string;
  meetingUrl?: string;
  notes?: string;
  createdAt: string;
}

export interface Reminder {
  id: number;
  userId: number;
  applicationId?: number;
  title: string;
  description?: string;
  reminderTime: string;
  completed: boolean;
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
  interviews?: Interview[];
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationSummary {
  total: number;
  saved: number;
  applied: number;
  screening: number;
  interview: number;
  offer: number;
  accepted: number;
  rejected: number;
  withdrawn: number;
}

export interface SourceMetric {
  source: string;
  totalCount: number;
  interviewCount: number;
  offerCount: number;
  conversionRate: number;
}

export interface VelocityMetric {
  weekLabel: string;
  count: number;
}

export interface AnalyticsOverview {
  totalApplications: number;
  activeApplications: number;
  responseRate: number;
  interviewRate: number;
  offerRate: number;
  averageSalaryMin?: number;
  averageSalaryMax?: number;
  stageCounts: Record<ApplicationStatus, number>;
  sourceBreakdown: SourceMetric[];
  weeklyVelocity: VelocityMetric[];
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
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

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface CreateApplicationPayload {
  job: {
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
    source: JobSource | string;
  };
  status: ApplicationStatus;
  appliedDate?: string;
  deadline?: string;
  followUpDate?: string;
  notes?: string;
}

export interface CreateInterviewPayload {
  applicationId: number;
  roundName: string;
  scheduledAt: string;
  interviewer?: string;
  meetingUrl?: string;
  notes?: string;
}

export interface CreateReminderPayload {
  applicationId?: number;
  title: string;
  description?: string;
  reminderTime: string;
}
