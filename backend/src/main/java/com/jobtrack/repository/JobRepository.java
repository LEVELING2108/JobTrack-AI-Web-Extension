package com.jobtrack.repository;

import com.jobtrack.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    Optional<Job> findByUrl(String url);

    @Query("SELECT j FROM Job j WHERE LOWER(j.company) = LOWER(:company) AND LOWER(j.title) = LOWER(:title)")
    Optional<Job> findByCompanyAndTitleIgnoreCase(@Param("company") String company, @Param("title") String title);
}
