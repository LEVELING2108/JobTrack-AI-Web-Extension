package com.jobtrack.dto.response;

import com.jobtrack.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponse {
    private Long id;
    private Long userId;
    private JobResponse job;
    private ApplicationStatus status;
    private Instant appliedDate;
    private Instant deadline;
    private Instant followUpDate;
    private String notes;
    private List<InterviewResponse> interviews;
    private Instant createdAt;
    private Instant updatedAt;
}
