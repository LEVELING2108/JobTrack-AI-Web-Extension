package com.jobtrack.service.impl;

import com.jobtrack.dto.request.CreateInterviewRequest;
import com.jobtrack.dto.response.InterviewResponse;
import com.jobtrack.entity.Application;
import com.jobtrack.entity.Interview;
import com.jobtrack.entity.User;
import com.jobtrack.enums.ApplicationStatus;
import com.jobtrack.exception.ResourceNotFoundException;
import com.jobtrack.mapper.InterviewMapper;
import com.jobtrack.repository.ApplicationRepository;
import com.jobtrack.repository.InterviewRepository;
import com.jobtrack.service.InterviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class InterviewServiceImpl implements InterviewService {

    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;
    private final InterviewMapper interviewMapper;

    @Override
    @Transactional
    public InterviewResponse scheduleInterview(User user, CreateInterviewRequest request) {
        Application application = applicationRepository.findByIdAndUserId(request.getApplicationId(), user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + request.getApplicationId()));

        Interview interview = interviewMapper.toEntity(request, application);
        Interview saved = interviewRepository.save(interview);

        // Automatically update application status to INTERVIEW if currently in earlier stage
        if (application.getStatus() == ApplicationStatus.SAVED || application.getStatus() == ApplicationStatus.APPLIED || application.getStatus() == ApplicationStatus.SCREENING) {
            application.setStatus(ApplicationStatus.INTERVIEW);
            applicationRepository.save(application);
        }

        log.info("Scheduled interview [id={}] for application [id={}]", saved.getId(), application.getId());
        return interviewMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InterviewResponse> getInterviewsForUser(User user) {
        return interviewRepository.findByUserIdOrderByScheduledAtAsc(user.getId())
                .stream()
                .map(interviewMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteInterview(User user, Long id) {
        Interview interview = interviewRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found with id: " + id));

        interviewRepository.delete(interview);
        log.info("Deleted interview [id={}] for user [{}]", id, user.getEmail());
    }
}
