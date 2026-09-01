package com.jobtrack.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateReminderRequest {

    private Long applicationId;

    @NotBlank(message = "Reminder title is required")
    private String title;

    private String description;

    @NotNull(message = "Reminder time is required")
    private Instant reminderTime;
}
