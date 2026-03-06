package com.wealth.overview_service.clients;

import com.wealth.overview_service.dto.RecommendationDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@FeignClient(name = "advisory")
public interface AdvisoryClient {
    @GetMapping("/api/recommendations/{portfolioId}")
    List<RecommendationDTO> getRecommendationsByPortfolio(@PathVariable("portfolioId") Long portfolioId);
}