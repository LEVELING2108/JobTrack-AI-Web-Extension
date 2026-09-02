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
public class AiMatchScoreRequest {
    private Long applicationId;
    private String jobTitle;
    private String company;
    @NotBlank(message = "Job description or requirements are required for match analysis")
    private String jobDescription;
    private String resumeText;
}
