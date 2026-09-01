package com.jobtrack.controller;

import com.jobtrack.dto.request.CreateApplicationRequest;
import com.jobtrack.dto.request.StatusUpdateRequest;
import com.jobtrack.dto.request.UpdateApplicationRequest;
import com.jobtrack.dto.response.ApiResponse;
import com.jobtrack.dto.response.ApplicationResponse;
import com.jobtrack.dto.response.ApplicationSummaryResponse;
import com.jobtrack.dto.response.PageResponse;
import com.jobtrack.enums.ApplicationStatus;
import com.jobtrack.security.CurrentUser;
import com.jobtrack.security.UserPrincipal;
import com.jobtrack.service.ApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
@Tag(name = "Applications", description = "Manage tracked job applications, status transitions, and personal notes")
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    @Operation(summary = "Track a new job application")
    public ResponseEntity<ApiResponse<ApplicationResponse>> createApplication(
            @CurrentUser UserPrincipal principal,
            @Valid @RequestBody CreateApplicationRequest request) {
        ApplicationResponse response = applicationService.createApplication(principal.getUser(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Job application saved successfully", response));
    }

    @GetMapping
    @Operation(summary = "Get paginated, filtered, and searched applications for current user")
    public ResponseEntity<ApiResponse<PageResponse<ApplicationResponse>>> getApplications(
            @CurrentUser UserPrincipal principal,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        PageResponse<ApplicationResponse> response = applicationService.getApplications(principal.getUser(), search, status, pageRequest);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get application details by ID (verified ownership)")
    public ResponseEntity<ApiResponse<ApplicationResponse>> getApplicationById(
            @CurrentUser UserPrincipal principal,
            @PathVariable Long id) {
        ApplicationResponse response = applicationService.getApplicationById(principal.getUser(), id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update application details, notes, and deadlines")
    public ResponseEntity<ApiResponse<ApplicationResponse>> updateApplication(
            @CurrentUser UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody UpdateApplicationRequest request) {
        ApplicationResponse response = applicationService.updateApplication(principal.getUser(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("Application updated successfully", response));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update application lifecycle stage")
    public ResponseEntity<ApiResponse<ApplicationResponse>> updateStatus(
            @CurrentUser UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request) {
        ApplicationResponse response = applicationService.updateStatus(principal.getUser(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("Status updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an application record")
    public ResponseEntity<ApiResponse<Void>> deleteApplication(
            @CurrentUser UserPrincipal principal,
            @PathVariable Long id) {
        applicationService.deleteApplication(principal.getUser(), id);
        return ResponseEntity.ok(ApiResponse.ok("Application deleted successfully", null));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get application count breakdown by status for current user")
    public ResponseEntity<ApiResponse<ApplicationSummaryResponse>> getSummary(
            @CurrentUser UserPrincipal principal) {
        ApplicationSummaryResponse summary = applicationService.getApplicationSummary(principal.getUser());
        return ResponseEntity.ok(ApiResponse.ok(summary));
    }
}
