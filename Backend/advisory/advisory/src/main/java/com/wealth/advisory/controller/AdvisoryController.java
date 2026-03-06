package com.wealth.advisory.controller;

import com.wealth.advisory.model.Recommendation;
import com.wealth.advisory.service.AdvisoryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@Slf4j
public class AdvisoryController {

    private final AdvisoryService advisoryService;

    public AdvisoryController(AdvisoryService advisoryService) {
        this.advisoryService = advisoryService;
    }

    @GetMapping("/{portfolioId}")
    public ResponseEntity<List<Recommendation>> getByPortfolio(@PathVariable Long portfolioId) {
        log.info("REST Request: GET existing recommendations for Portfolio: {}", portfolioId);
        List<Recommendation> existing = advisoryService.getRecommendationsByPortfolio(portfolioId);
        return ResponseEntity.ok(existing);
    }

    @PostMapping("/generate/{clientId}/{portfolioId}")
    public ResponseEntity<List<Recommendation>> generateAdvice(
            @PathVariable Long clientId,
            @PathVariable Long portfolioId) {
        log.info("REST Request: POST generate fresh advice for Client: {}, Portfolio: {}", clientId, portfolioId);
        List<Recommendation> recommendations = advisoryService.generateRecommendations(clientId, portfolioId);
        return ResponseEntity.ok(recommendations);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(@PathVariable Long id, @RequestParam String status) {
        log.info("REST Request: PUT update status for Rec ID: {} to {}", id, status);
        advisoryService.updateRecommendationStatus(id, status);
        return ResponseEntity.ok().build();
    }
}