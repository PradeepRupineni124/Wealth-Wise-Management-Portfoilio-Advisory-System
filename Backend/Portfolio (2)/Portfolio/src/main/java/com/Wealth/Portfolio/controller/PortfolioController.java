package com.Wealth.Portfolio.controller;


import com.Wealth.Portfolio.dto.HoldingDTO;
import com.Wealth.Portfolio.dto.PortfolioSummaryDTO;
import com.Wealth.Portfolio.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Wealth.Portfolio.dto.AddInvestmentRequestDTO;
import com.Wealth.Portfolio.dto.CreatePortfolioDTO;
import com.Wealth.Portfolio.model.Portfolio;

import java.util.List;

@RestController
@RequestMapping("/api/portfolio")
@Slf4j
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;

    @GetMapping("/{clientId}/summary")
    public ResponseEntity<PortfolioSummaryDTO> getPortfolioSummary(@PathVariable Long clientId) {
        log.info("REST request to get summary for Client ID: {}", clientId);
        PortfolioSummaryDTO summary = portfolioService.getPortfolioSummary(clientId);
        return ResponseEntity.ok(summary);
    }

    @PostMapping
    public ResponseEntity<Portfolio> createPortfolio(@RequestBody CreatePortfolioDTO request) {
        log.info("REST request to create portfolio for Client ID: {}", request.getClientId());

        // Pass the Client ID down to the service where Feign will do the magic
        Portfolio created = portfolioService.createPortfolio(request.getClientId());

        return ResponseEntity.ok(created);
    }

    @PostMapping("/{portfolioId}/holdings")
    public ResponseEntity<String> addInvestment(
            @PathVariable Long portfolioId,
            @RequestBody AddInvestmentRequestDTO requestDTO) {

        log.info("REST request to add investment for Portfolio ID: {}", portfolioId);
        portfolioService.addInvestmentToPortfolio(portfolioId, requestDTO);

        return ResponseEntity.ok("Investment added successfully");
    }

    @GetMapping("/{portfolioId}/holdings")
    public ResponseEntity<List<HoldingDTO>> getPortfolioHoldings(@PathVariable Long portfolioId) {
        log.info("REST request to get holdings for Portfolio ID: {}", portfolioId);
        List<HoldingDTO> holdings = portfolioService.getPortfolioHoldings(portfolioId);
        return ResponseEntity.ok(holdings);
    }

    @GetMapping("/{clientId}/id")
    public ResponseEntity<Long> getPortfolioId(@PathVariable Long clientId) {
        log.info("REST request to get Portfolio ID for Client ID: {}", clientId);
        Long portfolioId = portfolioService.getPortfolioIdByClientId(clientId);
        return ResponseEntity.ok(portfolioId);
    }

}