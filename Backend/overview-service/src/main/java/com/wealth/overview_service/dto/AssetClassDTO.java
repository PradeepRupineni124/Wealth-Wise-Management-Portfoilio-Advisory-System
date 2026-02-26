package com.wealth.overview_service.dto;

import lombok.Data;

@Data
public class AssetClassDTO {
    private String title;
    private String value; // e.g., "$700,000"
    private String badgeText; // e.g., "60%"
}