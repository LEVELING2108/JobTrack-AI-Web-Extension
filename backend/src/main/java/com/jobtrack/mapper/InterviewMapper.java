package com.jobtrack.mapper;

import com.jobtrack.dto.request.CreateInterviewRequest;
import com.jobtrack.dto.response.InterviewResponse;
import com.jobtrack.entity.Application;
import com.jobtrack.entity.Interview;
import org.springframework.stereotype.Component;

@Component
public class InterviewMapper {

    public Interview toEntity(CreateInterviewRequest request, Application application) {
        if (request == null) return null;

        return Interview.builder()
                .application(application)
                .roundName(request.getRoundName())
                .scheduledAt(request.getScheduledAt())
                .interviewer(request.getInterviewer())
                .meetingUrl(request.getMeetingUrl())
                .notes(request.getNotes())
                .build();
    }

    public InterviewResponse toResponse(Interview interview) {
        if (interview == null) return null;

        return InterviewResponse.builder()
                .id(interview.getId())
                .applicationId(interview.getApplication() != null ? interview.getApplication().getId() : null)
                .roundName(interview.getRoundName())
                .scheduledAt(interview.getScheduledAt())
                .interviewer(interview.getInterviewer())
                .meetingUrl(interview.getMeetingUrl())
                .notes(interview.getNotes())
                .createdAt(interview.getCreatedAt())
                .build();
    }
}
