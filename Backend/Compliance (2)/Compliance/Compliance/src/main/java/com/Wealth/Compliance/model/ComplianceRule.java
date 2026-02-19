package com.Wealth.Compliance.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "compliance_rules")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplianceRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String ruleCode;

    @Column(nullable = false)
    private String ruleName;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RuleCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RuleSeverity severity;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(length = 2000)
    private String regulatoryReference;

    @Column(length = 500)
    private String penaltyDescription;

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

    public enum RuleCategory {
        KYC, AML, TRADING, REPORTING, DATA_PRIVACY, RISK_MANAGEMENT, 
        TAX_COMPLIANCE, INVESTMENT_SUITABILITY, DISCLOSURE, OTHER
    }

    public enum RuleSeverity {
        LOW, MEDIUM, HIGH, CRITICAL
    }
}
