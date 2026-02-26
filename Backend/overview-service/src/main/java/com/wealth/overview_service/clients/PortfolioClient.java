package com.wealth.overview_service.clients;

import com.wealth.overview_service.config.FeignConfig;
import com.wealth.overview_service.dto.PortfolioSummaryResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

// Matches the Spring Application Name of your Portfolio microservice in Eureka
@FeignClient(name = "portfolio-service", configuration = FeignConfig.class)
public interface PortfolioClient {

    // Perfectly matches the endpoint in your PortfolioController
    @GetMapping("/api/portfolio/{clientId}/summary")
    PortfolioSummaryResponse getPortfolioSummary(@PathVariable("clientId") Long clientId);

}
