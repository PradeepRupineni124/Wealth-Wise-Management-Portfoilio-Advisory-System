package com.wealthwise.compliance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO to map the summary response from the Portfolio microservice
 * Used to extract the cash balance for liquidity calculations
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioSummaryResponseDTO {
    private Long portfolioId;
    private double cashBalance;
}