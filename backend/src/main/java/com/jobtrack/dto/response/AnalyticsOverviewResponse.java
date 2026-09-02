package com.jobtrack.dto.response;

import com.jobtrack.enums.ApplicationStatus;
import com.jobtrack.enums.JobSource;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsOverviewResponse {

    private long totalApplications;
    private long activeApplications;
    private double responseRate;
    private double interviewRate;
    private double offerRate;

    private Double averageSalaryMin;
    private Double averageSalaryMax;

    private Map<ApplicationStatus, Long> stageCounts;
    private List<SourceMetric> sourceBreakdown;
    private List<VelocityMetric> weeklyVelocity;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SourceMetric {
        private JobSource source;
        private long totalCount;
        private long interviewCount;
        private long offerCount;
        private double conversionRate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VelocityMetric {
        private String weekLabel;
        private long count;
    }
}
