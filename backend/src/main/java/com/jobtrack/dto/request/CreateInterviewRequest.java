package com.jobtrack.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateInterviewRequest {

    @NotNull(message = "Application ID is required")
    private Long applicationId;

    @NotBlank(message = "Round name is required (e.g. Technical Round 1)")
    private String roundName;

    @NotNull(message = "Scheduled time is required")
    private Instant scheduledAt;

    private String interviewer;
    private String meetingUrl;
    private String notes;
}
