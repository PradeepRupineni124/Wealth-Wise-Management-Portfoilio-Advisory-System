package com.Wealth.Compliance.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "compliance_checks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplianceCheck {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long ruleId;

    @Column(nullable = false)
    private String entityType; // PORTFOLIO, TRANSACTION, USER, etc.

    @Column(nullable = false)
    private Long entityId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CheckStatus status;

    @Column(length = 2000)
    private String checkDetails;

    @Column(length = 2000)
    private String violationDetails;

    @Column(length = 1000)
    private String remedialAction;

    @Column(nullable = false)
    private LocalDateTime checkDate;

    @Column
    private LocalDateTime resolvedDate;

    @Column
    private String resolvedBy;

    @Column(length = 1000)
    private String resolutionNotes;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (checkDate == null) {
            checkDate = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum CheckStatus {
        PENDING, PASSED, FAILED, UNDER_REVIEW, RESOLVED, EXEMPTED
    }
}
