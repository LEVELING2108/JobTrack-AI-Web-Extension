package com.jobtrack.repository;

import com.jobtrack.entity.Application;
import com.jobtrack.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    Optional<Application> findByUserIdAndJobId(Long userId, Long jobId);

    Optional<Application> findByIdAndUserId(Long id, Long userId);

    Page<Application> findByUserId(Long userId, Pageable pageable);

    Page<Application> findByUserIdAndStatus(Long userId, ApplicationStatus status, Pageable pageable);

    @Query("SELECT a FROM Application a JOIN a.job j WHERE a.user.id = :userId AND " +
           "(:search IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(j.company) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:status IS NULL OR a.status = :status)")
    Page<Application> searchApplications(
            @Param("userId") Long userId,
            @Param("search") String search,
            @Param("status") ApplicationStatus status,
            Pageable pageable
    );

    long countByUserIdAndStatus(Long userId, ApplicationStatus status);

    long countByUserId(Long userId);
}
