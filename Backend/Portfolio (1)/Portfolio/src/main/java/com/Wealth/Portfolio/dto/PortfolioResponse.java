package com.Wealth.Portfolio.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class PortfolioResponse {
    private Integer id; // Changed from Long
    private Integer clientId;
    private BigDecimal cashBalance;
    private Integer riskScore;
    private List<HoldingSummary> holdings; // For the UI table

    @Data
    public static class HoldingSummary {
        private Integer holdingId;
        private String symbol;
        private BigDecimal quantity;
        private BigDecimal marketValue;
    }
}
