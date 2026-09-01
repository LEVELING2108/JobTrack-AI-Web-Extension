package com.jobtrack.service;

import com.jobtrack.dto.request.CreateApplicationRequest;
import com.jobtrack.dto.request.CreateJobRequest;
import com.jobtrack.dto.response.ApplicationResponse;
import com.jobtrack.dto.response.JobResponse;
import com.jobtrack.entity.Application;
import com.jobtrack.entity.Job;
import com.jobtrack.entity.User;
import com.jobtrack.enums.ApplicationStatus;
import com.jobtrack.enums.JobSource;
import com.jobtrack.exception.DuplicateResourceException;
import com.jobtrack.mapper.ApplicationMapper;
import com.jobtrack.repository.ApplicationRepository;
import com.jobtrack.repository.JobRepository;
import com.jobtrack.service.impl.ApplicationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private JobService jobService;

    @Mock
    private ApplicationMapper applicationMapper;

    @InjectMocks
    private ApplicationServiceImpl applicationService;

    private User sampleUser;
    private Job sampleJob;
    private CreateApplicationRequest sampleRequest;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder().id(10L).email("dev@jobtrack.example").name("Dev User").build();
        sampleJob = Job.builder().id(20L).title("Java Engineer").company("TechCo").url("https://techco.example/job").source(JobSource.COMPANY_WEBSITE).build();

        CreateJobRequest jobRequest = CreateJobRequest.builder()
                .title("Java Engineer")
                .company("TechCo")
                .url("https://techco.example/job")
                .source(JobSource.COMPANY_WEBSITE)
                .build();

        sampleRequest = CreateApplicationRequest.builder()
                .job(jobRequest)
                .status(ApplicationStatus.SAVED)
                .build();
    }

    @Test
    @DisplayName("Should create application successfully when not already tracked by user")
    void testCreateApplication_Success() {
        when(jobService.getOrCreateJob(sampleRequest.getJob())).thenReturn(sampleJob);
        when(applicationRepository.findByUserIdAndJobId(sampleUser.getId(), sampleJob.getId())).thenReturn(Optional.empty());

        Application savedApp = Application.builder()
                .id(100L)
                .user(sampleUser)
                .job(sampleJob)
                .status(ApplicationStatus.SAVED)
                .build();

        when(applicationRepository.save(any(Application.class))).thenReturn(savedApp);

        JobResponse jobResp = JobResponse.builder().id(20L).title("Java Engineer").company("TechCo").build();
        ApplicationResponse expectedResp = ApplicationResponse.builder().id(100L).userId(10L).job(jobResp).status(ApplicationStatus.SAVED).build();
        when(applicationMapper.toResponse(savedApp)).thenReturn(expectedResp);

        ApplicationResponse result = applicationService.createApplication(sampleUser, sampleRequest);

        assertNotNull(result);
        verify(applicationRepository, times(1)).save(any(Application.class));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException (409) when user already has saved this job")
    void testCreateApplication_DuplicateThrowsException() {
        when(jobService.getOrCreateJob(sampleRequest.getJob())).thenReturn(sampleJob);
        Application existingApp = Application.builder().id(100L).user(sampleUser).job(sampleJob).build();
        when(applicationRepository.findByUserIdAndJobId(sampleUser.getId(), sampleJob.getId())).thenReturn(Optional.of(existingApp));

        assertThrows(DuplicateResourceException.class, () -> applicationService.createApplication(sampleUser, sampleRequest));
        verify(applicationRepository, never()).save(any(Application.class));
    }
}
