package com.jobtrack.service.impl;

import com.jobtrack.dto.response.AnalyticsOverviewResponse;
import com.jobtrack.dto.response.AnalyticsOverviewResponse.SourceMetric;
import com.jobtrack.dto.response.AnalyticsOverviewResponse.VelocityMetric;
import com.jobtrack.entity.Application;
import com.jobtrack.entity.Job;
import com.jobtrack.entity.User;
import com.jobtrack.enums.ApplicationStatus;
import com.jobtrack.enums.JobSource;
import com.jobtrack.repository.ApplicationRepository;
import com.jobtrack.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final ApplicationRepository applicationRepository;

    @Override
    @Transactional(readOnly = true)
    public AnalyticsOverviewResponse getOverview(User user) {
        // Fetch user's applications
        List<Application> applications = applicationRepository.searchApplications(
                user.getId(), null, null, PageRequest.of(0, 1000)
        ).getContent();

        long total = applications.size();
        if (total == 0) {
            return AnalyticsOverviewResponse.builder()
                    .totalApplications(0)
                    .activeApplications(0)
                    .responseRate(0.0)
                    .interviewRate(0.0)
                    .offerRate(0.0)
                    .stageCounts(Collections.emptyMap())
                    .sourceBreakdown(Collections.emptyList())
                    .weeklyVelocity(Collections.emptyList())
                    .build();
        }

        // Stage counts
        Map<ApplicationStatus, Long> stageCounts = applications.stream()
                .collect(Collectors.groupingBy(Application::getStatus, Collectors.counting()));

        long saved = stageCounts.getOrDefault(ApplicationStatus.SAVED, 0L);
        long applied = stageCounts.getOrDefault(ApplicationStatus.APPLIED, 0L);
        long screening = stageCounts.getOrDefault(ApplicationStatus.SCREENING, 0L);
        long interview = stageCounts.getOrDefault(ApplicationStatus.INTERVIEW, 0L);
        long offer = stageCounts.getOrDefault(ApplicationStatus.OFFER, 0L);
        long accepted = stageCounts.getOrDefault(ApplicationStatus.ACCEPTED, 0L);
        long rejected = stageCounts.getOrDefault(ApplicationStatus.REJECTED, 0L);
        long withdrawn = stageCounts.getOrDefault(ApplicationStatus.WITHDRAWN, 0L);

        long active = saved + applied + screening + interview + offer;
        double interviewRate = total > 0 ? ((double) (interview + offer + accepted) / total) * 100 : 0.0;
        double offerRate = total > 0 ? ((double) (offer + accepted) / total) * 100 : 0.0;
        double responseRate = total > 0 ? ((double) (screening + interview + offer + accepted + rejected) / total) * 100 : 0.0;

        // Salary averages
        List<BigDecimal> minSalaries = applications.stream()
                .map(Application::getJob)
                .map(Job::getSalaryMin)
                .filter(Objects::nonNull)
                .toList();

        List<BigDecimal> maxSalaries = applications.stream()
                .map(Application::getJob)
                .map(Job::getSalaryMax)
                .filter(Objects::nonNull)
                .toList();

        Double avgMin = minSalaries.isEmpty() ? null : minSalaries.stream().mapToDouble(BigDecimal::doubleValue).average().orElse(0.0);
        Double avgMax = maxSalaries.isEmpty() ? null : maxSalaries.stream().mapToDouble(BigDecimal::doubleValue).average().orElse(0.0);

        // Source breakdown
        Map<JobSource, List<Application>> bySource = applications.stream()
                .collect(Collectors.groupingBy(app -> app.getJob().getSource()));

        List<SourceMetric> sourceBreakdown = bySource.entrySet().stream()
                .map(entry -> {
                    JobSource src = entry.getKey();
                    List<Application> srcApps = entry.getValue();
                    long srcTotal = srcApps.size();
                    long srcInterviews = srcApps.stream().filter(a -> a.getStatus() == ApplicationStatus.INTERVIEW || a.getStatus() == ApplicationStatus.OFFER || a.getStatus() == ApplicationStatus.ACCEPTED).count();
                    long srcOffers = srcApps.stream().filter(a -> a.getStatus() == ApplicationStatus.OFFER || a.getStatus() == ApplicationStatus.ACCEPTED).count();
                    double conversion = srcTotal > 0 ? ((double) srcInterviews / srcTotal) * 100 : 0.0;

                    return SourceMetric.builder()
                            .source(src)
                            .totalCount(srcTotal)
                            .interviewCount(srcInterviews)
                            .offerCount(srcOffers)
                            .conversionRate(Math.round(conversion * 10.0) / 10.0)
                            .build();
                })
                .sorted(Comparator.comparingLong(SourceMetric::getTotalCount).reversed())
                .collect(Collectors.toList());

        // Velocity (weekly grouping)
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd").withZone(ZoneId.systemDefault());
        Map<String, Long> velocityMap = applications.stream()
                .collect(Collectors.groupingBy(
                        app -> formatter.format(app.getCreatedAt()),
                        LinkedHashMap::new,
                        Collectors.counting()
                ));

        List<VelocityMetric> weeklyVelocity = velocityMap.entrySet().stream()
                .map(e -> VelocityMetric.builder().weekLabel(e.getKey()).count(e.getValue()).build())
                .collect(Collectors.toList());

        return AnalyticsOverviewResponse.builder()
                .totalApplications(total)
                .activeApplications(active)
                .responseRate(Math.round(responseRate * 10.0) / 10.0)
                .interviewRate(Math.round(interviewRate * 10.0) / 10.0)
                .offerRate(Math.round(offerRate * 10.0) / 10.0)
                .averageSalaryMin(avgMin != null ? Math.round(avgMin * 100.0) / 100.0 : null)
                .averageSalaryMax(avgMax != null ? Math.round(avgMax * 100.0) / 100.0 : null)
                .stageCounts(stageCounts)
                .sourceBreakdown(sourceBreakdown)
                .weeklyVelocity(weeklyVelocity)
                .build();
    }
}
