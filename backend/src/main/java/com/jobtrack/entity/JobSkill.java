package com.jobtrack.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "job_skills", indexes = {
        @Index(name = "idx_job_skills_job", columnList = "job_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(name = "skill_name", nullable = false, length = 100)
    private String skillName;

    @Column(nullable = false)
    @Builder.Default
    private boolean required = true;
}
