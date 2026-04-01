package com.wealthwise.compliance.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Entity representing Compliance Audit Log entries
 * Matches the UI table structure for WealthWise Compliance Dashboard
 */
@Entity
@Table(name = "compliance_audit_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplianceAuditLog {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Client ID is required")
    @Column(nullable = false)
    private Long clientId;

    /**
     * Type of compliance review (e.g., "Quarterly Review", "Monthly Check")
     */
    @NotBlank(message = "Review type is required")
    @Size(min = 3, max = 100, message = "Review type must be between 3 and 100 characters")
    @Column(nullable = false, length = 100)
    private String reviewType;

    /**
     * Regulation being checked (e.g., "SEC Rule 15c3-3", "AML/CTF")
     */
    @NotBlank(message = "Regulation is required")
    @Size(min = 3, max = 200, message = "Regulation must be between 3 and 200 characters")
    @Column(nullable = false, length = 200)
    private String regulation;

    /**
     * Compliance status:
     * true = Compliant
     * false = Action Required
     */
    @NotNull(message = "Status is required")
    @Column(nullable = false)
    private Boolean status;

    /**
     * Findings or notes from the compliance check
     */
    @Size(max = 1000, message = "Findings cannot exceed 1000 characters")
    @Column(length = 1000)
    private String findings;

    /**
     * Date when the review was conducted
     */
    @NotNull(message = "Review date is required")
    @Column(nullable = false)
    private LocalDate reviewDate;

    /**
     * Date scheduled for the next review
     */
    @NotNull(message = "Next review date is required")
    @Column(nullable = false)
    private LocalDate nextReview;
}
