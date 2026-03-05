package com.wealthwise.analytics.dto;

import java.util.List;

public record PerformanceData(
        Double totalReturnYTD,
        Double sharpeRatio,
        Double beta,
        Double alpha,
        Double standardDeviation,
        List<String> historicalLabels,     // <-- ADDED
        List<Double> portfolioReturns,     // <-- ADDED
        List<Double> benchmarkReturns      // <-- ADDED
) {}
