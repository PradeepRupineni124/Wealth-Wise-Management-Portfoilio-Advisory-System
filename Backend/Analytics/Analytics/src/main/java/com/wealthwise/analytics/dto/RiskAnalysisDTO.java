package com.wealthwise.analytics.dto;

import java.time.LocalDateTime;

public record RiskAnalysisDTO(
    String clientId,
    RiskAdjustedMetrics riskAdjustedMetrics,
    ValueAtRisk valueAtRisk,
    RiskAssessment riskAssessment,
    LocalDateTime lastUpdated
) {}

