package com.jobtrack.service;

import com.jobtrack.dto.request.CreateInterviewRequest;
import com.jobtrack.dto.response.InterviewResponse;
import com.jobtrack.entity.User;

import java.util.List;

public interface InterviewService {
    InterviewResponse scheduleInterview(User user, CreateInterviewRequest request);
    List<InterviewResponse> getInterviewsForUser(User user);
    void deleteInterview(User user, Long id);
}
