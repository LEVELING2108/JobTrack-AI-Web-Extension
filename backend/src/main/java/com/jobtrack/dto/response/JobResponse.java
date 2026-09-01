package com.jobtrack.dto.response;

import com.jobtrack.enums.EmploymentType;
import com.jobtrack.enums.ExperienceLevel;
import com.jobtrack.enums.JobSource;
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
public class JobResponse {
    private Long id;
    private String title;
    private String company;
    private String location;
    private String url;
    private String description;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private String currency;
    private EmploymentType employmentType;
    private ExperienceLevel experienceLevel;
    private JobSource source;
    private String sourceJobId;
    private Instant postedDate;
    private Instant createdAt;
}
