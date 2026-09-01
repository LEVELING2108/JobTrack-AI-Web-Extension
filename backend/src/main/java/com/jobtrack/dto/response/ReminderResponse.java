package com.jobtrack.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReminderResponse {
    private Long id;
    private Long userId;
    private Long applicationId;
    private String title;
    private String description;
    private Instant reminderTime;
    private boolean completed;
    private Instant createdAt;
}
