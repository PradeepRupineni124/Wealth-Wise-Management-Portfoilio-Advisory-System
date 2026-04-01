package com.wealthwise.analytics.dto;

public record ValueAtRisk(
    VaRMetric confidenceLevel95_1Day,
    VaRMetric confidenceLevel95_1Month
) {}

