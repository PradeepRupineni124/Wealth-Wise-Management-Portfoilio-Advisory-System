package com.wealth.advisory.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wealth.advisory.client.PortfolioServiceClient;
import com.wealth.advisory.dto.*;
import com.wealth.advisory.model.Recommendation;
import com.wealth.advisory.repository.RecommendationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.google.genai.GoogleGenAiChatOptions;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AdvisoryService {

    private final ChatClient chatClient;
    private final RecommendationRepository recommendationRepository;
    private final PortfolioServiceClient portfolioClient;
    private final ObjectMapper objectMapper;
    private List<AssetDTO> cachedMarketAssets = null;

    public AdvisoryService(ChatClient.Builder chatClientBuilder,
                           RecommendationRepository recommendationRepository,
                           PortfolioServiceClient portfolioClient,
                           ObjectMapper objectMapper) {
        this.chatClient = chatClientBuilder
                .defaultSystem("You are an elite WealthWise portfolio manager and compliance officer.")
                .build();
        this.recommendationRepository = recommendationRepository;
        this.portfolioClient = portfolioClient;
        this.objectMapper = objectMapper;
        log.info("AdvisoryService initialized successfully.");
    }

    public List<Recommendation> getRecommendationsByPortfolio(Long portfolioId) {
        log.info("Fetching existing recommendations for Portfolio ID: {}", portfolioId);
        List<Recommendation> results = recommendationRepository.findByPortfolioID(portfolioId);
        log.info("Found {} existing records for Portfolio ID: {}", results.size(), portfolioId);
        return results;
    }

    @Transactional
    public void updateRecommendationStatus(Long id, String status) {
        log.info("Request to update Recommendation ID: {} to status: {}", id, status);
        recommendationRepository.findById(id).ifPresentOrElse(rec -> {
            rec.setStatus(status);
            recommendationRepository.save(rec);
            log.info("Successfully persisted status {} for Recommendation ID {}", status, id);
        }, () -> {
            log.error("Failed to update: Recommendation ID {} not found", id);
        });
    }

    @Transactional
    public List<Recommendation> generateRecommendations(Long clientId, Long portfolioId) {
        long startTime = System.currentTimeMillis();
        log.info("Starting AI Recommendation generation for Client: {}, Portfolio: {}", clientId, portfolioId);

        // 1. Fetch FRESH holdings data
        log.debug("Fetching portfolio summary and holdings from PortfolioService...");
        PortfolioSummaryDTO summary = portfolioClient.getPortfolioSummary(clientId);
        List<HoldingDTO> holdings = portfolioClient.getPortfolioHoldings(portfolioId);
        List<AssetDTO> marketAssets = getMarketAssets();

        // 2. CLEANUP
        List<Recommendation> existing = recommendationRepository.findByPortfolioID(portfolioId);
        List<Recommendation> pendingToDelete = existing.stream()
                .filter(r -> "PENDING".equals(r.getStatus()))
                .collect(Collectors.toList());

        if (!pendingToDelete.isEmpty()) {
            log.info("Cleaning up {} stale PENDING records for Portfolio ID: {}", pendingToDelete.size(), portfolioId);
            recommendationRepository.deleteAll(pendingToDelete);
        }

        // 3. Prepare AI Prompt Data
        String cash = (summary != null && summary.getCashBalance() != null) ? summary.getCashBalance().toString() : "0.00";
        double totalValue = holdings.stream()
                .mapToDouble(h -> h.getQty() != null ? h.getQty().doubleValue() * 100.0 : 0.0)
                .sum();

        String holdingsText = holdings.stream()
                .map(h -> {
                    double qty = h.getQty() != null ? h.getQty().doubleValue() : 0.0;
                    double allocation = totalValue > 0 ? ((qty * 100.0) / totalValue) * 100.0 : 0.0;
                    return String.format("%s (Qty: %s, Est. Allocation: %.1f%%)", h.getSymbol(), h.getQty(), allocation);
                })
                .collect(Collectors.joining(", "));

        log.debug("Prompt data prepared. Holdings count: {}, Market assets count: {}", holdings.size(), marketAssets.size());

        // 4. Call Gemini AI
        try {
            log.info("Invoking Gemini AI Chat Client...");
            AiRecommendationListResponse aiResponse = chatClient.prompt()
                    .user(u -> u.text("""
                    Client Cash: ${cash}
                    Client Holdings: {holdings}
                    Market Universe: {market}
                    
                    Analyze data and generate 2 to 4 distinct recommendations.
                    Compliance Rules: 
                    1. Max 40% allocation per holding.
                    2. Diversify if portfolio is 100% in one asset class.
                    
                    strategyType must be exactly: "Rebalancing Strategy" or "Personalized Investment".
                    Keep rationale under 15 words.
                    """)
                            .param("cash", cash)
                            .param("holdings", holdingsText)
                            .param("market", marketAssets.stream()
                                    .map(a -> a.getSymbol() + " - " + a.getSector())
                                    .collect(Collectors.joining(", "))))
                    .options(GoogleGenAiChatOptions.builder().temperature(0.1).build())
                    .call()
                    .entity(AiRecommendationListResponse.class);

            // 5. Save ONLY the new recommendations
            if (aiResponse != null && aiResponse.getRecommendations() != null) {
                log.info("AI generated {} new recommendations.", aiResponse.getRecommendations().size());
                for (AiRecommendationResponse recDto : aiResponse.getRecommendations()) {
                    String serializedAction = objectMapper.writeValueAsString(recDto);
                    Recommendation newRec = Recommendation.builder()
                            .portfolioID(portfolioId)
                            .suggestedAction(serializedAction)
                            .date(new Date())
                            .status("PENDING")
                            .build();
                    recommendationRepository.save(newRec);
                }
            } else {
                log.warn("AI returned an empty or null response for Portfolio ID: {}", portfolioId);
            }
        } catch (Exception e) {
            log.error("CRITICAL ERROR during AI generation: {}", e.getMessage(), e);
        }

        List<Recommendation> finalResults = recommendationRepository.findByPortfolioID(portfolioId);
        log.info("Generation complete. Returning {} total records (including history) in {} ms",
                finalResults.size(), (System.currentTimeMillis() - startTime));
        return finalResults;
    }

    private List<AssetDTO> getMarketAssets() {
        if (this.cachedMarketAssets == null || this.cachedMarketAssets.isEmpty()) {
            log.info("Market asset cache is empty. Fetching from PortfolioService...");
            this.cachedMarketAssets = portfolioClient.getAllMarketAssets();
        }
        return this.cachedMarketAssets;
    }
}