package com.jobtrack.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiCoverLetterRequest {
    private Long applicationId;
    @NotBlank(message = "Job title is required")
    private String jobTitle;
    @NotBlank(message = "Company name is required")
    private String company;
    private String jobDescription;
    private String customTone;
    private String userExperienceSummary;
}
