package com.jobtrack.dto.request;

import com.jobtrack.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateApplicationRequest {
    private ApplicationStatus status;
    private Instant appliedDate;
    private Instant deadline;
    private Instant followUpDate;
    private String notes;
}
