package com.wealthwise.compliance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Compliance Dashboard Summary Cards
 * Drives the top metric cards in the UI
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplianceSummaryDTO {

    /**
     * Overall compliance score (0-100)
     * Calculated as: (compliant logs / total logs) * 100
     */
    private int complianceScore;

    /**
     * Number of active compliance checks
     * Total count of all audit logs
     */
    private long activeChecks;

    /**
     * Number of items requiring action
     * Count of logs with status = false
     */
    private long actionRequired;

    /**
     * Number of reports generated
     * Count of completed reviews (status = true)
     */
    private int reportsGenerated;
}
