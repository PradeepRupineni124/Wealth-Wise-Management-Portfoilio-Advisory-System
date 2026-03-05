package com.wealthwise.analytics.dto;

public record AssetMetric(
        String assetClass,
        Double marketValue,
        Double returnRate
) {}