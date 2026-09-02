package com.jobtrack.service;

import com.jobtrack.dto.request.AiCoverLetterRequest;
import com.jobtrack.dto.request.AiInterviewPrepRequest;
import com.jobtrack.dto.request.AiMatchScoreRequest;
import com.jobtrack.dto.response.AiCoverLetterResponse;
import com.jobtrack.dto.response.AiInterviewPrepResponse;
import com.jobtrack.dto.response.AiMatchScoreResponse;
import com.jobtrack.entity.User;

public interface GeminiAiService {
    AiMatchScoreResponse calculateMatchScore(User user, AiMatchScoreRequest request);
    AiCoverLetterResponse generateCoverLetter(User user, AiCoverLetterRequest request);
    AiInterviewPrepResponse generateInterviewPrep(User user, AiInterviewPrepRequest request);
}
