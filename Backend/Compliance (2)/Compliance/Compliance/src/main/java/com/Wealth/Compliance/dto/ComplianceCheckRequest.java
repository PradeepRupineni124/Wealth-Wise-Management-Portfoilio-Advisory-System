package com.Wealth.Compliance.dto;

import com.Wealth.Compliance.model.ComplianceCheck;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplianceCheckRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Rule ID is required")
    private Long ruleId;

    @NotBlank(message = "Entity type is required")
    private String entityType;

    @NotNull(message = "Entity ID is required")
    private Long entityId;

    @NotNull(message = "Check status is required")
    private ComplianceCheck.CheckStatus status;

    @Size(max = 2000, message = "Check details cannot exceed 2000 characters")
    private String checkDetails;

    @Size(max = 2000, message = "Violation details cannot exceed 2000 characters")
    private String violationDetails;

    @Size(max = 1000, message = "Remedial action cannot exceed 1000 characters")
    private String remedialAction;
}
