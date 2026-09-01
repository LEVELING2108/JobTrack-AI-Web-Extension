package com.jobtrack.controller;

import com.jobtrack.dto.request.CreateInterviewRequest;
import com.jobtrack.dto.response.ApiResponse;
import com.jobtrack.dto.response.InterviewResponse;
import com.jobtrack.security.CurrentUser;
import com.jobtrack.security.UserPrincipal;
import com.jobtrack.service.InterviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/interviews")
@RequiredArgsConstructor
@Tag(name = "Interviews", description = "Schedule and manage interview rounds linked to applications")
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping
    @Operation(summary = "Schedule a new interview round")
    public ResponseEntity<ApiResponse<InterviewResponse>> scheduleInterview(
            @CurrentUser UserPrincipal principal,
            @Valid @RequestBody CreateInterviewRequest request) {
        InterviewResponse response = interviewService.scheduleInterview(principal.getUser(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Interview scheduled successfully", response));
    }

    @GetMapping
    @Operation(summary = "List all scheduled interviews for current user")
    public ResponseEntity<ApiResponse<List<InterviewResponse>>> getInterviews(
            @CurrentUser UserPrincipal principal) {
        List<InterviewResponse> interviews = interviewService.getInterviewsForUser(principal.getUser());
        return ResponseEntity.ok(ApiResponse.ok(interviews));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Cancel / delete scheduled interview")
    public ResponseEntity<ApiResponse<Void>> deleteInterview(
            @CurrentUser UserPrincipal principal,
            @PathVariable Long id) {
        interviewService.deleteInterview(principal.getUser(), id);
        return ResponseEntity.ok(ApiResponse.ok("Interview deleted successfully", null));
    }
}
