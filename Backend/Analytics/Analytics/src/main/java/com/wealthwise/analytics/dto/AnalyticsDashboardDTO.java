package com.wealthwise.analytics.dto;

import java.util.List;
import java.time.LocalDateTime;

public record AnalyticsDashboardDTO(
    String clientId,
    Double totalPortfolioValue,
    PerformanceData performanceData,
    List<Sector> sectorAllocation,
    List<KeyMetric> keyMetrics,
    LocalDateTime lastUpdated
) {}
