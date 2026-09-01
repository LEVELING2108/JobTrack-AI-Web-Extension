package com.jobtrack.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

/**
 * Scheduled interview round linked to a user's job application.
 */
@Entity
@Table(name = "interviews", indexes = {
        @Index(name = "idx_interviews_application", columnList = "application_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Column(name = "round_name", nullable = false, length = 100)
    private String roundName;

    @Column(name = "scheduled_at", nullable = false)
    private Instant scheduledAt;

    @Column(length = 255)
    private String interviewer;

    @Column(name = "meeting_url", columnDefinition = "TEXT")
    private String meetingUrl;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
