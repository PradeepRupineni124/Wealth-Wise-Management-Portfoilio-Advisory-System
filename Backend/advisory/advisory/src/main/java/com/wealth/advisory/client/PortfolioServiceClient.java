package com.wealth.advisory.client;
import com.wealth.advisory.dto.AssetDTO;
import com.wealth.advisory.dto.HoldingDTO;
import com.wealth.advisory.dto.PortfolioSummaryDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@FeignClient(name = "portfolio-service")
public interface PortfolioServiceClient {
    @GetMapping("/api/portfolio/{portfolioId}/holdings")
    List<HoldingDTO> getPortfolioHoldings(@PathVariable("portfolioId") Long portfolioId);

    @GetMapping("/api/portfolio/{clientId}/summary")
    PortfolioSummaryDTO getPortfolioSummary(@PathVariable("clientId") Long clientId);

    @GetMapping("/api/assets")
    List<AssetDTO> getAllMarketAssets();
}