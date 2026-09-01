package com.jobtrack.entity;

import com.jobtrack.enums.EmploymentType;
import com.jobtrack.enums.ExperienceLevel;
import com.jobtrack.enums.JobSource;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Normalized job posting entity shared across users to prevent duplicate job records.
 */
@Entity
@Table(name = "jobs", indexes = {
        @Index(name = "idx_jobs_url", columnList = "url"),
        @Index(name = "idx_jobs_company", columnList = "company")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 255)
    private String company;

    @Column(length = 255)
    private String location;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String url;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "salary_min", precision = 12, scale = 2)
    private BigDecimal salaryMin;

    @Column(name = "salary_max", precision = 12, scale = 2)
    private BigDecimal salaryMax;

    @Column(length = 10)
    @Builder.Default
    private String currency = "USD";

    @Enumerated(EnumType.STRING)
    @Column(name = "employment_type", length = 50)
    private EmploymentType employmentType;

    @Enumerated(EnumType.STRING)
    @Column(name = "experience_level", length = 50)
    private ExperienceLevel experienceLevel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 100)
    private JobSource source;

    @Column(name = "source_job_id", length = 255)
    private String sourceJobId;

    @Column(name = "posted_date")
    private Instant postedDate;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<JobSkill> requiredSkills = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
