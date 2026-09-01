package com.jobtrack.mapper;

import com.jobtrack.dto.response.ApplicationResponse;
import com.jobtrack.dto.response.InterviewResponse;
import com.jobtrack.entity.Application;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ApplicationMapper {

    private final JobMapper jobMapper;
    private final InterviewMapper interviewMapper;

    public ApplicationResponse toResponse(Application app) {
        if (app == null) return null;

        List<InterviewResponse> interviews = app.getInterviews() != null
                ? app.getInterviews().stream().map(interviewMapper::toResponse).collect(Collectors.toList())
                : Collections.emptyList();

        return ApplicationResponse.builder()
                .id(app.getId())
                .userId(app.getUser() != null ? app.getUser().getId() : null)
                .job(jobMapper.toResponse(app.getJob()))
                .status(app.getStatus())
                .appliedDate(app.getAppliedDate())
                .deadline(app.getDeadline())
                .followUpDate(app.getFollowUpDate())
                .notes(app.getNotes())
                .interviews(interviews)
                .createdAt(app.getCreatedAt())
                .updatedAt(app.getUpdatedAt())
                .build();
    }
}
