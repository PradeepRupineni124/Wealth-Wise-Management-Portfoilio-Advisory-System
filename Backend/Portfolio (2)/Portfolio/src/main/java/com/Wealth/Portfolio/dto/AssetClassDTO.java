package com.Wealth.Portfolio.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AssetClassDTO {
    private String title;
    private String value;
    private String badgeText;
    private String badgeBgColor;
    private String trendText;
    private String trendColor;
}