package com.wealth.overview_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OverviewDto {

    private String clientName;
    private String advisorName;
    private Double totalPortfolioValue;
    private Double totalValueChange;
    private Double annualReturnPercentage;
    private Double riskScore;
    private Integer activeInvestmentsCount;
    private List<AssetAllocationDTO> assetAllocation;
    private List<ActivityDTO> recentActivities;
    private List<NotificationDto> notifications;
}
