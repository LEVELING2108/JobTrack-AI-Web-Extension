package com.jobtrack.service;

import com.jobtrack.dto.request.CreateJobRequest;
import com.jobtrack.dto.response.JobResponse;
import com.jobtrack.entity.Job;

public interface JobService {
    Job getOrCreateJob(CreateJobRequest request);
    JobResponse getJobById(Long id);
}
