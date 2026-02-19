package com.wealthwise.analytics.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "portfolio-service")
public interface PortfolioFeignClient {

    @GetMapping("/api/portfolio/{clientId}")
    PortfolioResponse getPortfolioByClientId(@PathVariable String clientId);

    record PortfolioResponse(
        String clientId,
        Double currentValue,
        Double beginningValue,
        Double[] monthlyReturns
    ) {}
}
