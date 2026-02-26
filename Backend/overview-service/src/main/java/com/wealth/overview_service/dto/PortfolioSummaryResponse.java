package com.wealth.overview_service.dto;

import lombok.Data;
import java.util.List;

@Data
public class PortfolioSummaryResponse {
    private Double totalValue;
    private Double totalValueChange;
    private Double annualReturnPercentage;
    private Double riskScore;
    private Integer activeInvestmentsCount;
    private List<AssetAllocationDTO> assetAllocations;
}