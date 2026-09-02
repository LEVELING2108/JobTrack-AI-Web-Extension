import { useMutation } from '@tanstack/react-query';
import { aiService } from '../services/aiService';

export const useAiMatchScoreMutation = () => {
  return useMutation({
    mutationFn: (payload: {
      applicationId?: number;
      jobTitle: string;
      company: string;
      jobDescription: string;
      resumeText?: string;
    }) => aiService.calculateMatchScore(payload),
  });
};

export const useAiCoverLetterMutation = () => {
  return useMutation({
    mutationFn: (payload: {
      applicationId?: number;
      jobTitle: string;
      company: string;
      jobDescription?: string;
      customTone?: string;
    }) => aiService.generateCoverLetter(payload),
  });
};

export const useAiInterviewPrepMutation = () => {
  return useMutation({
    mutationFn: (payload: {
      applicationId?: number;
      jobTitle: string;
      company: string;
      jobDescription?: string;
    }) => aiService.generateInterviewPrep(payload),
  });
};
