package com.jobtrack.controller;

import com.jobtrack.dto.response.AnalyticsOverviewResponse;
import com.jobtrack.dto.response.ApiResponse;
import com.jobtrack.security.CurrentUser;
import com.jobtrack.security.UserPrincipal;
import com.jobtrack.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Aggregated performance metrics, source effectiveness, and conversion rates")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/overview")
    @Operation(summary = "Get aggregated analytics overview for current authenticated user")
    public ResponseEntity<ApiResponse<AnalyticsOverviewResponse>> getOverview(@CurrentUser UserPrincipal principal) {
        AnalyticsOverviewResponse overview = analyticsService.getOverview(principal.getUser());
        return ResponseEntity.ok(ApiResponse.ok(overview));
    }
}
