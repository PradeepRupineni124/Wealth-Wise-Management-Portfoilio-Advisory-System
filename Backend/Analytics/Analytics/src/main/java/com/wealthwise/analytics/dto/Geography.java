package com.wealthwise.analytics.dto;

public record Geography(
        String region,
        Double percentage,
        String colorClass // e.g., "bg-blue", "bg-green", "bg-yellow"
) {}