package com.jobtrack.dto.request;

import com.jobtrack.enums.EmploymentType;
import com.jobtrack.enums.ExperienceLevel;
import com.jobtrack.enums.JobSource;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateJobRequest {

    @NotBlank(message = "Job title is required")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;

    @NotBlank(message = "Company name is required")
    @Size(max = 255, message = "Company name cannot exceed 255 characters")
    private String company;

    private String location;

    @NotBlank(message = "Job URL is required")
    private String url;

    private String description;

    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private String currency;

    private EmploymentType employmentType;
    private ExperienceLevel experienceLevel;

    @NotNull(message = "Job source is required")
    private JobSource source;

    private String sourceJobId;
    private Instant postedDate;
}
