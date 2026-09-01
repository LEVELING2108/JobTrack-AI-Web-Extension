package com.jobtrack.dto.request;

import com.jobtrack.enums.ApplicationStatus;
import jakarta.validation.Valid;
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
public class CreateApplicationRequest {

    private Long jobId;

    @Valid
    private CreateJobRequest job;

    @NotNull(message = "Application status is required")
    private ApplicationStatus status;

    private Instant appliedDate;
    private Instant deadline;
    private Instant followUpDate;
    private String notes;
}
