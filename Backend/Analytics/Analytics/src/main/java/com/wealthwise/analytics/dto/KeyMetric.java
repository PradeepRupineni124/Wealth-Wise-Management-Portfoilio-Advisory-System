package com.wealthwise.analytics.dto;

public record KeyMetric(
    String metricName,
    Double value,
    String unit,
    Double changePercent,
    String trend
) {}
