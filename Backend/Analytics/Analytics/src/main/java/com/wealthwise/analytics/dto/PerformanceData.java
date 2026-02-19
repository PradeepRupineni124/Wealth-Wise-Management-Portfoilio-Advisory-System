package com.wealthwise.analytics.dto;

public record PerformanceData(
    Double totalReturnYTD,
    Double sharpeRatio,
    Double beta,
    Double alpha,
    Double standardDeviation
) {}
