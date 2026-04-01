package com.Wealth.Portfolio.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class PortfolioSummaryDTO {
    private Long portfolioId; // Added this so the frontend knows the ID!
    private BigDecimal cashBalance;
    private List<StatCardDTO> stats;
    private List<AssetClassDTO> assetClasses;
    // Removed: private List<HoldingDTO> portfolio;
}