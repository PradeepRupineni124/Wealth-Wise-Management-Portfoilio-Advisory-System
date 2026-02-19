package com.Wealth.Compliance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplianceStatistics {
    private Long totalRules;
    private Long activeRules;
    private Long totalChecks;
    private Long passedChecks;
    private Long failedChecks;
    private Long pendingChecks;
    private Long underReviewChecks;
    private Double complianceRate;
    private Long criticalViolations;
    private Long highViolations;
    private Long mediumViolations;
    private Long lowViolations;
}
