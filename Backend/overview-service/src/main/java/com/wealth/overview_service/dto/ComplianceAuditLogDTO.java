package com.wealth.overview_service.dto;

import lombok.Data;

@Data
public class ComplianceAuditLogDTO {
    private Long id;
    private String reviewType; // e.g., "KYC Verification"
    private String findings;   // e.g., "Client KYC status is pending..."
    private String status;     // e.g., "Action Required" or "Compliant"
    private String auditDate;
}
