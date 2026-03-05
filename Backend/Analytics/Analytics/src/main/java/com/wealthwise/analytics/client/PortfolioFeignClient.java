package com.wealthwise.analytics.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.math.BigDecimal;
import java.util.List;

@FeignClient(name = "portfolio-service", fallback = PortfolioFeignClientFallback.class)
public interface PortfolioFeignClient {

    // 1. Get the summary to find the Portfolio ID and Cash Balance
    @GetMapping("/api/portfolio/{clientId}/summary")
    PortfolioSummaryDTO getPortfolioSummary(@PathVariable("clientId") Long clientId);

    // 2. Get the actual holdings to calculate values dynamically
    @GetMapping("/api/portfolio/{portfolioId}/holdings")
    List<HoldingDTO> getPortfolioHoldings(@PathVariable("portfolioId") Long portfolioId);

    // --- DTO MAPPINGS ---
    record PortfolioSummaryDTO(
            Long portfolioId,
            BigDecimal cashBalance
    ) {}

    record HoldingDTO(
            Long holdingId,
            String symbol,
            String name,
            String type,
            String sector,
            BigDecimal qty,
            BigDecimal avgPrice,
            BigDecimal currentPrice,
            BigDecimal marketValue,
            BigDecimal allocationPct,
            String geography
    ) {}
}