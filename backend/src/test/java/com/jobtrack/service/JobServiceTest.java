package com.jobtrack.service;

import com.jobtrack.dto.request.CreateJobRequest;
import com.jobtrack.entity.Job;
import com.jobtrack.enums.JobSource;
import com.jobtrack.mapper.JobMapper;
import com.jobtrack.repository.JobRepository;
import com.jobtrack.service.impl.JobServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobServiceTest {

    @Mock
    private JobRepository jobRepository;

    @Mock
    private JobMapper jobMapper;

    @Mock
    private UrlNormalizationService urlNormalizationService;

    @InjectMocks
    private JobServiceImpl jobService;

    private CreateJobRequest sampleRequest;

    @BeforeEach
    void setUp() {
        sampleRequest = CreateJobRequest.builder()
                .title("Backend Engineer")
                .company("Acme Corp")
                .url("https://example.com/jobs/123?utm_source=linkedin")
                .source(JobSource.LINKEDIN)
                .build();
    }

    @Test
    @DisplayName("Should return existing job when normalized URL is found")
    void testGetOrCreateJob_FoundByUrl() {
        String normalizedUrl = "https://example.com/jobs/123";
        when(urlNormalizationService.normalize(sampleRequest.getUrl())).thenReturn(normalizedUrl);

        Job existingJob = Job.builder()
                .id(1L)
                .title("Backend Engineer")
                .company("Acme Corp")
                .url(normalizedUrl)
                .source(JobSource.LINKEDIN)
                .build();

        when(jobRepository.findByUrl(normalizedUrl)).thenReturn(Optional.of(existingJob));

        Job result = jobService.getOrCreateJob(sampleRequest);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(jobRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should create and save new job when URL not found")
    void testGetOrCreateJob_CreatesNew() {
        String normalizedUrl = "https://example.com/jobs/123";
        when(urlNormalizationService.normalize(sampleRequest.getUrl())).thenReturn(normalizedUrl);
        when(jobRepository.findByUrl(normalizedUrl)).thenReturn(Optional.empty());
        when(jobRepository.findByCompanyAndTitleIgnoreCase("Acme Corp", "Backend Engineer")).thenReturn(Optional.empty());

        Job newJob = Job.builder()
                .id(2L)
                .title("Backend Engineer")
                .company("Acme Corp")
                .url(normalizedUrl)
                .source(JobSource.LINKEDIN)
                .build();

        when(jobMapper.toEntity(sampleRequest)).thenReturn(newJob);
        when(jobRepository.save(newJob)).thenReturn(newJob);

        Job result = jobService.getOrCreateJob(sampleRequest);

        assertNotNull(result);
        assertEquals(2L, result.getId());
        verify(jobRepository, times(1)).save(newJob);
    }
}
