package com.jobtrack.mapper;

import com.jobtrack.dto.request.CreateReminderRequest;
import com.jobtrack.dto.response.ReminderResponse;
import com.jobtrack.entity.Application;
import com.jobtrack.entity.Reminder;
import com.jobtrack.entity.User;
import org.springframework.stereotype.Component;

@Component
public class ReminderMapper {

    public Reminder toEntity(CreateReminderRequest request, User user, Application application) {
        if (request == null) return null;

        return Reminder.builder()
                .user(user)
                .application(application)
                .title(request.getTitle())
                .description(request.getDescription())
                .reminderTime(request.getReminderTime())
                .completed(false)
                .build();
    }

    public ReminderResponse toResponse(Reminder reminder) {
        if (reminder == null) return null;

        return ReminderResponse.builder()
                .id(reminder.getId())
                .userId(reminder.getUser() != null ? reminder.getUser().getId() : null)
                .applicationId(reminder.getApplication() != null ? reminder.getApplication().getId() : null)
                .title(reminder.getTitle())
                .description(reminder.getDescription())
                .reminderTime(reminder.getReminderTime())
                .completed(reminder.isCompleted())
                .createdAt(reminder.getCreatedAt())
                .build();
    }
}
