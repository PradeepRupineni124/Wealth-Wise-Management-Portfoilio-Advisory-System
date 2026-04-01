package com.wealthwise.analytics.dto;

public record RiskAdjustedMetrics(
    MetricComparison volatility,
    MetricComparison sharpeRatio,
    MetricComparison beta,
    MetricComparison maxDrawdown
) {}

