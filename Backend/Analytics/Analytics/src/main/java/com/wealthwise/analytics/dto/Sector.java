package com.wealthwise.analytics.dto;

public record Sector(
    String sectorName,
    Double allocationPercent,
    Double value
) {}
