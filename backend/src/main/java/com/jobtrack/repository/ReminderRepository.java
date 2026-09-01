package com.jobtrack.repository;

import com.jobtrack.entity.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {

    List<Reminder> findByUserIdAndCompletedFalseOrderByReminderTimeAsc(Long userId);

    List<Reminder> findByUserIdOrderByReminderTimeAsc(Long userId);

    Optional<Reminder> findByIdAndUserId(Long id, Long userId);
}
