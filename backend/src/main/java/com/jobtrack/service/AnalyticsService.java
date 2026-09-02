package com.jobtrack.service;

import com.jobtrack.dto.response.AnalyticsOverviewResponse;
import com.jobtrack.entity.User;

public interface AnalyticsService {
    AnalyticsOverviewResponse getOverview(User user);
}
