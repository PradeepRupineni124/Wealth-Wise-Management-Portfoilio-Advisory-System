package com.wealthwise.compliance.client;

import com.wealthwise.compliance.config.FeignConfig;
import com.wealthwise.compliance.dto.PortfolioHoldingDTO;
import com.wealthwise.compliance.dto.PortfolioSummaryResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

/**
 * Feign client used to communicate with the portfolio-service
 */
@FeignClient(name = "portfolio-service", configuration = FeignConfig.class)
public interface PortfolioClient {

    // STEP 1: Get the portfolio ID using the client ID
    @GetMapping("/api/portfolio/{clientId}/id")
    Long getPortfolioIdByClientId(@PathVariable("clientId") Long clientId);

    // STEP 2: Fetch the holdings using the portfolio ID we just got
    @GetMapping("/api/portfolio/{portfolioId}/holdings")
    List<PortfolioHoldingDTO> getPortfolioHoldings(@PathVariable("portfolioId") Long portfolioId);

    // Fetch the summary to extract the exact cash balance
    @GetMapping("/api/portfolio/{clientId}/summary")
    PortfolioSummaryResponseDTO getPortfolioSummaryByClientId(@PathVariable("clientId") Long clientId);
}