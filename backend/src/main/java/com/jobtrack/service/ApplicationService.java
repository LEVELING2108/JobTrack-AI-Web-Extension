package com.jobtrack.service;

import com.jobtrack.dto.request.CreateApplicationRequest;
import com.jobtrack.dto.request.StatusUpdateRequest;
import com.jobtrack.dto.request.UpdateApplicationRequest;
import com.jobtrack.dto.response.ApplicationResponse;
import com.jobtrack.dto.response.ApplicationSummaryResponse;
import com.jobtrack.dto.response.PageResponse;
import com.jobtrack.entity.User;
import com.jobtrack.enums.ApplicationStatus;
import org.springframework.data.domain.Pageable;

public interface ApplicationService {
    ApplicationResponse createApplication(User user, CreateApplicationRequest request);
    ApplicationResponse getApplicationById(User user, Long id);
    PageResponse<ApplicationResponse> getApplications(User user, String search, ApplicationStatus status, Pageable pageable);
    ApplicationResponse updateApplication(User user, Long id, UpdateApplicationRequest request);
    ApplicationResponse updateStatus(User user, Long id, StatusUpdateRequest request);
    void deleteApplication(User user, Long id);
    ApplicationSummaryResponse getApplicationSummary(User user);
}
