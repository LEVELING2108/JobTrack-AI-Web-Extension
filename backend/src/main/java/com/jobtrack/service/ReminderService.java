package com.jobtrack.service;

import com.jobtrack.dto.request.CreateReminderRequest;
import com.jobtrack.dto.response.ReminderResponse;
import com.jobtrack.entity.User;

import java.util.List;

public interface ReminderService {
    ReminderResponse createReminder(User user, CreateReminderRequest request);
    List<ReminderResponse> getActiveReminders(User user);
    ReminderResponse toggleComplete(User user, Long id);
    void deleteReminder(User user, Long id);
}
