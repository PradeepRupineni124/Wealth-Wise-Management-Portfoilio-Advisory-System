package com.wealth.overview_service.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class PortfolioSummaryResponse {
    private Long portfolioId;
    private BigDecimal cashBalance;
    private List<StatCardDTO> stats; // Contains Top Cards
    private List<AssetClassDTO> assetClasses; // Contains Asset Allocation
}
