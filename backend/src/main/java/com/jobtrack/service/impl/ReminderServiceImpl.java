package com.jobtrack.service.impl;

import com.jobtrack.dto.request.CreateReminderRequest;
import com.jobtrack.dto.response.ReminderResponse;
import com.jobtrack.entity.Application;
import com.jobtrack.entity.Reminder;
import com.jobtrack.entity.User;
import com.jobtrack.exception.ResourceNotFoundException;
import com.jobtrack.mapper.ReminderMapper;
import com.jobtrack.repository.ApplicationRepository;
import com.jobtrack.repository.ReminderRepository;
import com.jobtrack.service.ReminderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReminderServiceImpl implements ReminderService {

    private final ReminderRepository reminderRepository;
    private final ApplicationRepository applicationRepository;
    private final ReminderMapper reminderMapper;

    @Override
    @Transactional
    public ReminderResponse createReminder(User user, CreateReminderRequest request) {
        Application application = null;
        if (request.getApplicationId() != null) {
            application = applicationRepository.findByIdAndUserId(request.getApplicationId(), user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + request.getApplicationId()));
        }

        Reminder reminder = reminderMapper.toEntity(request, user, application);
        Reminder saved = reminderRepository.save(reminder);
        log.info("Created reminder [id={}] for user [{}]", saved.getId(), user.getEmail());
        return reminderMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReminderResponse> getActiveReminders(User user) {
        return reminderRepository.findByUserIdAndCompletedFalseOrderByReminderTimeAsc(user.getId())
                .stream()
                .map(reminderMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ReminderResponse toggleComplete(User user, Long id) {
        Reminder reminder = reminderRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Reminder not found with id: " + id));

        reminder.setCompleted(!reminder.isCompleted());
        Reminder updated = reminderRepository.save(reminder);
        return reminderMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteReminder(User user, Long id) {
        Reminder reminder = reminderRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Reminder not found with id: " + id));

        reminderRepository.delete(reminder);
        log.info("Deleted reminder [id={}] for user [{}]", id, user.getEmail());
    }
}
