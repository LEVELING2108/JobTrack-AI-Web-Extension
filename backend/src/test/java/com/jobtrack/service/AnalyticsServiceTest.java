package com.jobtrack.service;

import com.jobtrack.dto.response.AnalyticsOverviewResponse;
import com.jobtrack.entity.Application;
import com.jobtrack.entity.Job;
import com.jobtrack.entity.User;
import com.jobtrack.enums.ApplicationStatus;
import com.jobtrack.enums.JobSource;
import com.jobtrack.repository.ApplicationRepository;
import com.jobtrack.service.impl.AnalyticsServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @InjectMocks
    private AnalyticsServiceImpl analyticsService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder().id(1L).email("user@jobtrack.test").build();
    }

    @Test
    @DisplayName("Should return empty analytics when user has no applications")
    void testGetOverview_Empty() {
        when(applicationRepository.searchApplications(eq(1L), any(), any(), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of()));

        AnalyticsOverviewResponse overview = analyticsService.getOverview(sampleUser);

        assertNotNull(overview);
        assertEquals(0, overview.getTotalApplications());
        assertEquals(0.0, overview.getInterviewRate());
    }

    @Test
    @DisplayName("Should compute correct conversion rates and salary averages")
    void testGetOverview_WithData() {
        Job job1 = Job.builder().id(1L).title("Frontend").company("A").source(JobSource.LINKEDIN).salaryMin(BigDecimal.valueOf(100000)).salaryMax(BigDecimal.valueOf(120000)).build();
        Job job2 = Job.builder().id(2L).title("Backend").company("B").source(JobSource.LINKEDIN).salaryMin(BigDecimal.valueOf(120000)).salaryMax(BigDecimal.valueOf(140000)).build();

        Application app1 = Application.builder().id(10L).user(sampleUser).job(job1).status(ApplicationStatus.INTERVIEW).createdAt(Instant.now()).build();
        Application app2 = Application.builder().id(20L).user(sampleUser).job(job2).status(ApplicationStatus.APPLIED).createdAt(Instant.now()).build();

        when(applicationRepository.searchApplications(eq(1L), any(), any(), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(app1, app2)));

        AnalyticsOverviewResponse overview = analyticsService.getOverview(sampleUser);

        assertNotNull(overview);
        assertEquals(2, overview.getTotalApplications());
        assertEquals(50.0, overview.getInterviewRate());
        assertEquals(110000.0, overview.getAverageSalaryMin());
        assertEquals(130000.0, overview.getAverageSalaryMax());
    }
}
