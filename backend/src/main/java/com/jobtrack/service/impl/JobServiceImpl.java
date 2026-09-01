package com.jobtrack.service.impl;

import com.jobtrack.dto.request.CreateJobRequest;
import com.jobtrack.dto.response.JobResponse;
import com.jobtrack.entity.Job;
import com.jobtrack.exception.ResourceNotFoundException;
import com.jobtrack.mapper.JobMapper;
import com.jobtrack.repository.JobRepository;
import com.jobtrack.service.JobService;
import com.jobtrack.service.UrlNormalizationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final JobMapper jobMapper;
    private final UrlNormalizationService urlNormalizationService;

    @Override
    @Transactional
    public Job getOrCreateJob(CreateJobRequest request) {
        String normalizedUrl = urlNormalizationService.normalize(request.getUrl());
        request.setUrl(normalizedUrl);

        // 1. Check if normalized URL already exists
        Optional<Job> existingJob = jobRepository.findByUrl(normalizedUrl);
        if (existingJob.isPresent()) {
            log.info("Found existing normalized job by URL [id={}]: {}", existingJob.get().getId(), normalizedUrl);
            return existingJob.get();
        }

        // 2. Secondary duplicate check: company + title (case-insensitive)
        Optional<Job> companyTitleMatch = jobRepository.findByCompanyAndTitleIgnoreCase(request.getCompany().trim(), request.getTitle().trim());
        if (companyTitleMatch.isPresent()) {
            log.info("Found existing job by company and title [id={}]: {} at {}", companyTitleMatch.get().getId(), request.getTitle(), request.getCompany());
            return companyTitleMatch.get();
        }

        // 3. Create new job record
        Job newJob = jobMapper.toEntity(request);
        Job saved = jobRepository.save(newJob);
        log.info("Created new normalized job [id={}]: {} at {}", saved.getId(), saved.getTitle(), saved.getCompany());
        return saved;
    }

    @Override
    @Transactional(readOnly = true)
    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job posting not found with id: " + id));
        return jobMapper.toResponse(job);
    }
}
