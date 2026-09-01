package com.jobtrack.controller;

import com.jobtrack.dto.request.CreateJobRequest;
import com.jobtrack.dto.response.ApiResponse;
import com.jobtrack.dto.response.JobResponse;
import com.jobtrack.entity.Job;
import com.jobtrack.mapper.JobMapper;
import com.jobtrack.service.JobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
@Tag(name = "Jobs", description = "Query and submit normalized job postings")
public class JobController {

    private final JobService jobService;
    private final JobMapper jobMapper;

    @PostMapping
    @Operation(summary = "Submit or lookup normalized job posting")
    public ResponseEntity<ApiResponse<JobResponse>> getOrCreateJob(@Valid @RequestBody CreateJobRequest request) {
        Job job = jobService.getOrCreateJob(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Job processed successfully", jobMapper.toResponse(job)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get job details by ID")
    public ResponseEntity<ApiResponse<JobResponse>> getJobById(@PathVariable Long id) {
        JobResponse job = jobService.getJobById(id);
        return ResponseEntity.ok(ApiResponse.ok(job));
    }
}
