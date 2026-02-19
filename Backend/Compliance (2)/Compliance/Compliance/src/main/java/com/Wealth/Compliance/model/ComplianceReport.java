package com.Wealth.Compliance.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "compliance_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplianceReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String reportNumber;

    @Column(nullable = false)
    private String reportTitle;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportType reportType;

    @Column(nullable = false)
    private LocalDate reportPeriodStart;

    @Column(nullable = false)
    private LocalDate reportPeriodEnd;

    @Column(nullable = false)
    private Integer totalChecks;

    @Column(nullable = false)
    private Integer passedChecks;

    @Column(nullable = false)
    private Integer failedChecks;

    @Column(nullable = false)
    private Integer pendingChecks;

    @Column
    private Double complianceScore;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportStatus status;

    @Column(length = 3000)
    private String summary;

    @Column(length = 2000)
    private String recommendations;

    @Column
    private String generatedBy;

    @Column
    private String reviewedBy;

    @Column
    private LocalDateTime reviewedDate;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum ReportType {
        DAILY, WEEKLY, MONTHLY, QUARTERLY, ANNUAL, AD_HOC, REGULATORY
    }

    public enum ReportStatus {
        DRAFT, PENDING_REVIEW, APPROVED, SUBMITTED, ARCHIVED
    }
}
