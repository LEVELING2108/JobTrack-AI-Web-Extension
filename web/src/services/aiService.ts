import api from './api';
import {
  AiMatchScoreResult,
  AiCoverLetterResult,
  AiInterviewPrepResult,
  ApiResponse,
} from '../types';

export const aiService = {
  async calculateMatchScore(payload: {
    applicationId?: number;
    jobTitle: string;
    company: string;
    jobDescription: string;
    resumeText?: string;
  }): Promise<AiMatchScoreResult> {
    const res = await api.post<ApiResponse<AiMatchScoreResult>>('/ai/match-score', payload);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Failed to calculate match score');
    }
    return res.data.data;
  },

  async generateCoverLetter(payload: {
    applicationId?: number;
    jobTitle: string;
    company: string;
    jobDescription?: string;
    customTone?: string;
  }): Promise<AiCoverLetterResult> {
    const res = await api.post<ApiResponse<AiCoverLetterResult>>('/ai/cover-letter', payload);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Failed to generate cover letter');
    }
    return res.data.data;
  },

  async generateInterviewPrep(payload: {
    applicationId?: number;
    jobTitle: string;
    company: string;
    jobDescription?: string;
  }): Promise<AiInterviewPrepResult> {
    const res = await api.post<ApiResponse<AiInterviewPrepResult>>('/ai/interview-prep', payload);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Failed to generate interview prep');
    }
    return res.data.data;
  },
};
