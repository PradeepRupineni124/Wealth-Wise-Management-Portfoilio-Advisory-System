package com.wealth.overview_service.service;

import com.wealth.overview_service.clients.ClientServiceClient;
import com.wealth.overview_service.clients.PortfolioClient;
import com.wealth.overview_service.dto.ClientDTO;
import com.wealth.overview_service.dto.HoldingDTO;
import com.wealth.overview_service.dto.PortfolioSummaryResponse;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RemoteIntegrationService {

    private final PortfolioClient portfolioClient;
    private final ClientServiceClient clientServiceClient;

    // --- 1. CLIENT SERVICE CIRCUIT BREAKER ---
    @CircuitBreaker(name = "clientService", fallbackMethod = "clientFallback")
    public ClientDTO getClientProfileSafely(Long clientId) {
        return clientServiceClient.getClientProfile(clientId);
    }

    public ClientDTO clientFallback(Long clientId, Exception e) {
        log.error("Circuit Breaker OPEN: Client Service down for ID {}. Reason: {}", clientId, e.getMessage());
        ClientDTO fallbackClient = new ClientDTO();
        fallbackClient.setFullName("Client " + clientId); // Default name so UI doesn't crash
        return fallbackClient;
    }

    // --- 2. PORTFOLIO SUMMARY CIRCUIT BREAKER ---
    @CircuitBreaker(name = "portfolioService", fallbackMethod = "portfolioSummaryFallback")
    public PortfolioSummaryResponse getPortfolioSummarySafely(Long clientId) {
        return portfolioClient.getPortfolioSummary(clientId);
    }

    public PortfolioSummaryResponse portfolioSummaryFallback(Long clientId, Exception e) {
        log.error("Circuit Breaker OPEN: Portfolio Summary down for ID {}. Reason: {}", clientId, e.getMessage());
        return null; // Your OverviewService is already designed to gracefully handle a null summary!
    }

    // --- 3. PORTFOLIO HOLDINGS CIRCUIT BREAKER ---
    @CircuitBreaker(name = "portfolioService", fallbackMethod = "holdingsFallback")
    public List<HoldingDTO> getPortfolioHoldingsSafely(Long portfolioId) {
        return portfolioClient.getPortfolioHoldings(portfolioId);
    }

    public List<HoldingDTO> holdingsFallback(Long portfolioId, Exception e) {
        log.error("Circuit Breaker OPEN: Portfolio Holdings down for Portfolio ID {}. Reason: {}", portfolioId, e.getMessage());
        return new ArrayList<>(); // Return an empty list so recent activities are just blank
    }
}