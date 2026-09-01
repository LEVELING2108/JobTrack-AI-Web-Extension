package com.jobtrack.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewResponse {
    private Long id;
    private Long applicationId;
    private String roundName;
    private Instant scheduledAt;
    private String interviewer;
    private String meetingUrl;
    private String notes;
    private Instant createdAt;
}
