package com.jobtrack.entity;

import com.jobtrack.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Connects a User to a Job posting with application status tracking and personal notes.
 */
@Entity
@Table(name = "applications",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_user_job", columnNames = {"user_id", "job_id"})
        },
        indexes = {
                @Index(name = "idx_applications_user_status", columnList = "user_id, status"),
                @Index(name = "idx_applications_created", columnList = "created_at")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.SAVED;

    @Column(name = "applied_date")
    private Instant appliedDate;

    @Column(name = "deadline")
    private Instant deadline;

    @Column(name = "follow_up_date")
    private Instant followUpDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Interview> interviews = new ArrayList<>();

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Reminder> reminders = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
