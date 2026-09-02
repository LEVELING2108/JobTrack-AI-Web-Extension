package com.jobtrack.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobtrack.dto.request.AiCoverLetterRequest;
import com.jobtrack.dto.request.AiInterviewPrepRequest;
import com.jobtrack.dto.request.AiMatchScoreRequest;
import com.jobtrack.dto.response.AiCoverLetterResponse;
import com.jobtrack.dto.response.AiInterviewPrepResponse;
import com.jobtrack.dto.response.AiMatchScoreResponse;
import com.jobtrack.entity.User;
import com.jobtrack.service.impl.GeminiAiServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class GeminiAiServiceTest {

    private GeminiAiServiceImpl aiService;
    private User sampleUser;

    @BeforeEach
    void setUp() {
        aiService = new GeminiAiServiceImpl(new ObjectMapper());
        sampleUser = User.builder().id(1L).name("Dev User").email("dev@jobtrack.test").build();
    }

    @Test
    @DisplayName("Should generate match score with matching and missing skills via heuristic engine")
    void testCalculateMatchScore_Fallback() {
        AiMatchScoreRequest request = AiMatchScoreRequest.builder()
                .jobTitle("Senior Backend Engineer")
                .company("Acme Corp")
                .jobDescription("Looking for a Java and Spring Boot expert with React skills.")
                .build();

        AiMatchScoreResponse response = aiService.calculateMatchScore(sampleUser, request);

        assertNotNull(response);
        assertTrue(response.getMatchScore() > 0 && response.getMatchScore() <= 100);
        assertFalse(response.getMatchingSkills().isEmpty());
        assertFalse(response.getMissingSkills().isEmpty());
    }

    @Test
    @DisplayName("Should generate customized cover letter containing candidate and company names")
    void testGenerateCoverLetter() {
        AiCoverLetterRequest request = AiCoverLetterRequest.builder()
                .jobTitle("Fullstack Developer")
                .company("Google")
                .build();

        AiCoverLetterResponse response = aiService.generateCoverLetter(sampleUser, request);

        assertNotNull(response);
        assertNotNull(response.getCoverLetter());
        assertTrue(response.getCoverLetter().contains("Google"));
        assertTrue(response.getCoverLetter().contains("Dev User"));
    }

    @Test
    @DisplayName("Should generate interview questions tailored to the position")
    void testGenerateInterviewPrep() {
        AiInterviewPrepRequest request = AiInterviewPrepRequest.builder()
                .jobTitle("Staff Software Engineer")
                .company("Stripe")
                .jobDescription("Lead high-availability distributed ledger services.")
                .build();

        AiInterviewPrepResponse response = aiService.generateInterviewPrep(sampleUser, request);

        assertNotNull(response);
        assertFalse(response.getQuestions().isEmpty());
        assertFalse(response.getKeyThemes().isEmpty());
    }
}
