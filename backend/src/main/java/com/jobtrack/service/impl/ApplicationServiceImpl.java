package com.jobtrack.service.impl;

import com.jobtrack.dto.request.CreateApplicationRequest;
import com.jobtrack.dto.request.StatusUpdateRequest;
import com.jobtrack.dto.request.UpdateApplicationRequest;
import com.jobtrack.dto.response.ApplicationResponse;
import com.jobtrack.dto.response.ApplicationSummaryResponse;
import com.jobtrack.dto.response.PageResponse;
import com.jobtrack.entity.Application;
import com.jobtrack.entity.Job;
import com.jobtrack.entity.User;
import com.jobtrack.enums.ApplicationStatus;
import com.jobtrack.exception.BadRequestException;
import com.jobtrack.exception.DuplicateResourceException;
import com.jobtrack.exception.ResourceNotFoundException;
import com.jobtrack.mapper.ApplicationMapper;
import com.jobtrack.repository.ApplicationRepository;
import com.jobtrack.repository.JobRepository;
import com.jobtrack.service.ApplicationService;
import com.jobtrack.service.JobService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final JobService jobService;
    private final ApplicationMapper applicationMapper;

    @Override
    @Transactional
    public ApplicationResponse createApplication(User user, CreateApplicationRequest request) {
        Job job;

        if (request.getJobId() != null) {
            job = jobRepository.findById(request.getJobId())
                    .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + request.getJobId()));
        } else if (request.getJob() != null) {
            job = jobService.getOrCreateJob(request.getJob());
        } else {
            throw new BadRequestException("Either jobId or job details must be provided");
        }

        // Deduplication: Verify user has not already saved this job
        Optional<Application> existingApp = applicationRepository.findByUserIdAndJobId(user.getId(), job.getId());
        if (existingApp.isPresent()) {
            throw new DuplicateResourceException("You have already added this job to your applications");
        }

        Application app = Application.builder()
                .user(user)
                .job(job)
                .status(request.getStatus() != null ? request.getStatus() : ApplicationStatus.SAVED)
                .appliedDate(request.getAppliedDate())
                .deadline(request.getDeadline())
                .followUpDate(request.getFollowUpDate())
                .notes(request.getNotes())
                .build();

        Application saved = applicationRepository.save(app);
        log.info("Created application [id={}] for user [{}] and job [{}]", saved.getId(), user.getEmail(), job.getTitle());
        return applicationMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationResponse getApplicationById(User user, Long id) {
        Application app = applicationRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));
        return applicationMapper.toResponse(app);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ApplicationResponse> getApplications(User user, String search, ApplicationStatus status, Pageable pageable) {
        Page<Application> page = applicationRepository.searchApplications(
                user.getId(),
                (search != null && !search.isBlank()) ? search.trim() : null,
                status,
                pageable
        );
        return PageResponse.from(page.map(applicationMapper::toResponse));
    }

    @Override
    @Transactional
    public ApplicationResponse updateApplication(User user, Long id, UpdateApplicationRequest request) {
        Application app = applicationRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        if (request.getStatus() != null) {
            app.setStatus(request.getStatus());
        }
        if (request.getAppliedDate() != null) {
            app.setAppliedDate(request.getAppliedDate());
        }
        if (request.getDeadline() != null) {
            app.setDeadline(request.getDeadline());
        }
        if (request.getFollowUpDate() != null) {
            app.setFollowUpDate(request.getFollowUpDate());
        }
        if (request.getNotes() != null) {
            app.setNotes(request.getNotes());
        }

        Application updated = applicationRepository.save(app);
        return applicationMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public ApplicationResponse updateStatus(User user, Long id, StatusUpdateRequest request) {
        Application app = applicationRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        app.setStatus(request.getStatus());
        if (request.getStatus() == ApplicationStatus.APPLIED && app.getAppliedDate() == null) {
            app.setAppliedDate(Instant.now());
        }

        Application updated = applicationRepository.save(app);
        log.info("Updated status of application [id={}] to {}", id, request.getStatus());
        return applicationMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteApplication(User user, Long id) {
        Application app = applicationRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        applicationRepository.delete(app);
        log.info("Deleted application [id={}] for user [{}]", id, user.getEmail());
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationSummaryResponse getApplicationSummary(User user) {
        Long userId = user.getId();
        return ApplicationSummaryResponse.builder()
                .total(applicationRepository.countByUserId(userId))
                .saved(applicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.SAVED))
                .applied(applicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.APPLIED))
                .screening(applicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.SCREENING))
                .interview(applicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.INTERVIEW))
                .offer(applicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.OFFER))
                .accepted(applicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.ACCEPTED))
                .rejected(applicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.REJECTED))
                .withdrawn(applicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.WITHDRAWN))
                .build();
    }
}
