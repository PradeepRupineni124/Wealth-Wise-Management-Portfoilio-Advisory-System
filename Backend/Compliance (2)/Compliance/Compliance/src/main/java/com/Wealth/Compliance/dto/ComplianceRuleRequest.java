package com.Wealth.Compliance.dto;

import com.Wealth.Compliance.model.ComplianceRule;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplianceRuleRequest {

    @NotBlank(message = "Rule code is required")
    @Size(min = 2, max = 50, message = "Rule code must be between 2 and 50 characters")
    private String ruleCode;

    @NotBlank(message = "Rule name is required")
    @Size(min = 3, max = 200, message = "Rule name must be between 3 and 200 characters")
    private String ruleName;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @NotNull(message = "Rule category is required")
    private ComplianceRule.RuleCategory category;

    @NotNull(message = "Rule severity is required")
    private ComplianceRule.RuleSeverity severity;

    private Boolean isActive = true;

    @Size(max = 2000, message = "Regulatory reference cannot exceed 2000 characters")
    private String regulatoryReference;

    @Size(max = 500, message = "Penalty description cannot exceed 500 characters")
    private String penaltyDescription;
}
