package com.wealthwise.analytics.client;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

@Component // Extremely important so Spring can find it!
public class PortfolioFeignClientFallback implements PortfolioFeignClient {

    @Override
    public PortfolioSummaryDTO getPortfolioSummary(Long clientId) {
        System.err.println("⚠️ CIRCUIT BREAKER TRIGGERED: Portfolio Service is down! Returning default summary.");

        // Return a dummy portfolio ID (-1) and 0 cash balance to prevent crashes
        return new PortfolioSummaryDTO(-1L, BigDecimal.ZERO);
    }

    @Override
    public List<HoldingDTO> getPortfolioHoldings(Long portfolioId) {
        System.err.println("⚠️ CIRCUIT BREAKER TRIGGERED: Portfolio Service is down! Returning empty holdings.");

        // Return an empty list so the Analytics charts just show 0% / empty
        return Collections.emptyList();
    }
}