package com.jobtrack.repository;

import com.jobtrack.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {

    List<Interview> findByApplicationIdOrderByScheduledAtAsc(Long applicationId);

    @Query("SELECT i FROM Interview i JOIN i.application a WHERE a.user.id = :userId ORDER BY i.scheduledAt ASC")
    List<Interview> findByUserIdOrderByScheduledAtAsc(@Param("userId") Long userId);

    @Query("SELECT i FROM Interview i JOIN i.application a WHERE i.id = :id AND a.user.id = :userId")
    Optional<Interview> findByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);
}
