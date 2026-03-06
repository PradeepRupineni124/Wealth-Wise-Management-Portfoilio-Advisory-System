package com.wealth.overview_service.service;

import com.wealth.overview_service.clients.AdvisoryClient;
import com.wealth.overview_service.clients.ClientServiceClient;
import com.wealth.overview_service.clients.ComplianceClient;
import com.wealth.overview_service.clients.PortfolioClient;
import com.wealth.overview_service.dto.*;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    private final AdvisoryClient advisoryClient;
    private final ComplianceClient complianceClient;

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

    // --- 4. ADVISORY SERVICE CIRCUIT BREAKER ---
    @CircuitBreaker(name = "advisory", fallbackMethod = "advisoryFallback")
    public List<NotificationDto> getAdvisoryNotificationsSafely(Long portfolioId) {
        List<RecommendationDTO> recommendations = advisoryClient.getRecommendationsByPortfolio(portfolioId);
        ObjectMapper mapper = new ObjectMapper(); // We need this to parse the trapped JSON string!

        return recommendations.stream()
                .filter(rec -> rec.getStatus() != null && rec.getStatus().equalsIgnoreCase("PENDING"))
                .limit(1) // Keep only the top recommendation
                .map(rec -> {
                    RecommendationResponse aiRec = null;

                    // 1. Crack open the stringified JSON
                    try {
                        if (rec.getSuggestedAction() != null) {
                            aiRec = mapper.readValue(rec.getSuggestedAction(), RecommendationResponse.class);
                        }
                    } catch (Exception e) {
                        log.error("Failed to parse Advisory suggestedAction string", e);
                    }

                    // 2. Extract the values safely
                    String title = (aiRec != null && aiRec.getTitle() != null) ? aiRec.getTitle() : "New Advisory Recommendation";
                    String priority = (aiRec != null && aiRec.getPriority() != null) ? aiRec.getPriority() : "INFO";

                    String messageText = (aiRec != null && aiRec.getAction() != null) ? aiRec.getAction() :
                            ((aiRec != null && aiRec.getRationale() != null) ? aiRec.getRationale() : "Review your portfolio for new insights.");

                    // 3. Map priority to UI colors ("High" = DANGER/Red)
                    boolean isHighPriority = priority.equalsIgnoreCase("High");
                    String uiType = isHighPriority ? "DANGER" : "INFO";

                    // 4. Send to Angular!
                    return new NotificationDto(
                            String.valueOf(rec.getRecommendationID()),
                            title,
                            messageText,
                            "New",
                            uiType
                    );
                }).toList();
    }

    public List<NotificationDto> advisoryFallback(Long portfolioId, Exception e) {
        log.error("Circuit Breaker OPEN: Advisory down for Portfolio {}. Reason: {}", portfolioId, e.getMessage());
        return new ArrayList<>();
    }

    // --- COMPLIANCE SERVICE CIRCUIT BREAKER ---
    @CircuitBreaker(name = "compliance-service", fallbackMethod = "complianceFallback")
    public List<NotificationDto> getComplianceNotificationsSafely(Long clientId) {
        List<ComplianceAuditLogDTO> logs = complianceClient.getAuditLogsByClient(clientId);

        return logs.stream()
                // THE FIX: Foolproof filter! It now catches anything that isn't green/compliant.
                .filter(log -> log.getStatus() != null &&
                        !log.getStatus().equalsIgnoreCase("Compliant") &&
                        !log.getStatus().equalsIgnoreCase("true"))
                .limit(1) // <--- Optional: Limits compliance warnings to 1 so the UI stays clean
                .map(log -> new NotificationDto(
                        String.valueOf(log.getId()),
                        log.getReviewType() != null ? log.getReviewType() + " Due" : "Compliance Check Due",
                        log.getFindings() != null ? log.getFindings() : "Action required to maintain compliance.",
                        log.getAuditDate() != null ? log.getAuditDate() : "Recently",
                        "WARNING"
                )).toList();
    }

    public List<NotificationDto> complianceFallback(Long clientId, Exception e) {
        log.error("Circuit Breaker OPEN: Compliance down for Client {}. Reason: {}", clientId, e.getMessage());
        return new ArrayList<>();
    }
}