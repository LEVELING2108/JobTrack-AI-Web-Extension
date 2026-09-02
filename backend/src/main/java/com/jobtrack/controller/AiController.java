package com.jobtrack.controller;

import com.jobtrack.dto.request.AiCoverLetterRequest;
import com.jobtrack.dto.request.AiInterviewPrepRequest;
import com.jobtrack.dto.request.AiMatchScoreRequest;
import com.jobtrack.dto.response.AiCoverLetterResponse;
import com.jobtrack.dto.response.AiInterviewPrepResponse;
import com.jobtrack.dto.response.AiMatchScoreResponse;
import com.jobtrack.dto.response.ApiResponse;
import com.jobtrack.security.CurrentUser;
import com.jobtrack.security.UserPrincipal;
import com.jobtrack.service.GeminiAiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@Tag(name = "AI Copilot", description = "AI-powered job matching, cover letter synthesis, and interview prep")
public class AiController {

    private final GeminiAiService geminiAiService;

    @PostMapping("/match-score")
    @Operation(summary = "Calculate resume-to-job match score and skill gaps")
    public ResponseEntity<ApiResponse<AiMatchScoreResponse>> calculateMatchScore(
            @CurrentUser UserPrincipal principal,
            @Valid @RequestBody AiMatchScoreRequest request) {
        AiMatchScoreResponse response = geminiAiService.calculateMatchScore(principal.getUser(), request);
        return ResponseEntity.ok(ApiResponse.ok("Match score calculated", response));
    }

    @PostMapping("/cover-letter")
    @Operation(summary = "Generate a tailored cover letter based on role and candidate background")
    public ResponseEntity<ApiResponse<AiCoverLetterResponse>> generateCoverLetter(
            @CurrentUser UserPrincipal principal,
            @Valid @RequestBody AiCoverLetterRequest request) {
        AiCoverLetterResponse response = geminiAiService.generateCoverLetter(principal.getUser(), request);
        return ResponseEntity.ok(ApiResponse.ok("Cover letter generated", response));
    }

    @PostMapping("/interview-prep")
    @Operation(summary = "Generate role-tailored interview questions and preparation guide")
    public ResponseEntity<ApiResponse<AiInterviewPrepResponse>> generateInterviewPrep(
            @CurrentUser UserPrincipal principal,
            @Valid @RequestBody AiInterviewPrepRequest request) {
        AiInterviewPrepResponse response = geminiAiService.generateInterviewPrep(principal.getUser(), request);
        return ResponseEntity.ok(ApiResponse.ok("Interview prep questions generated", response));
    }
}
