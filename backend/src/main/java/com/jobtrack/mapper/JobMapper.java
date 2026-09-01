package com.jobtrack.mapper;

import com.jobtrack.dto.request.CreateJobRequest;
import com.jobtrack.dto.response.JobResponse;
import com.jobtrack.entity.Job;
import org.springframework.stereotype.Component;

@Component
public class JobMapper {

    public Job toEntity(CreateJobRequest request) {
        if (request == null) return null;

        return Job.builder()
                .title(request.getTitle())
                .company(request.getCompany())
                .location(request.getLocation())
                .url(request.getUrl())
                .description(request.getDescription())
                .salaryMin(request.getSalaryMin())
                .salaryMax(request.getSalaryMax())
                .currency(request.getCurrency() != null ? request.getCurrency() : "USD")
                .employmentType(request.getEmploymentType())
                .experienceLevel(request.getExperienceLevel())
                .source(request.getSource())
                .sourceJobId(request.getSourceJobId())
                .postedDate(request.getPostedDate())
                .build();
    }

    public JobResponse toResponse(Job job) {
        if (job == null) return null;

        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .company(job.getCompany())
                .location(job.getLocation())
                .url(job.getUrl())
                .description(job.getDescription())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .currency(job.getCurrency())
                .employmentType(job.getEmploymentType())
                .experienceLevel(job.getExperienceLevel())
                .source(job.getSource())
                .sourceJobId(job.getSourceJobId())
                .postedDate(job.getPostedDate())
                .createdAt(job.getCreatedAt())
                .build();
    }
}
