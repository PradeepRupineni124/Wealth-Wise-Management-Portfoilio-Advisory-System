package com.wealthwise.compliance.service;

import com.wealthwise.compliance.client.ClientClient;
import com.wealthwise.compliance.client.PortfolioClient;
import com.wealthwise.compliance.dto.*;
import com.wealthwise.compliance.entity.ComplianceAuditLog;
import com.wealthwise.compliance.exception.ComplianceCalculationException;
import com.wealthwise.compliance.exception.ResourceNotFoundException;
import com.wealthwise.compliance.repository.ComplianceAuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ComplianceService {

    private final ComplianceAuditLogRepository auditLogRepository;
    private final PortfolioClient portfolioClient;
    private final ClientClient clientClient;

    public ComplianceSummaryDTO getComplianceSummaryByClient(Long clientId) {
        log.debug("Calculating metrics for clientId: {}", clientId);

        long totalChecks = auditLogRepository.countByClientId(clientId);
        long compliantCount = auditLogRepository.countByClientIdAndStatus(clientId, true);
        long actionRequiredCount = auditLogRepository.countByClientIdAndStatus(clientId, false);

        int complianceScore = (totalChecks > 0) ? (int) Math.round((compliantCount * 100.0) / totalChecks) : 0;

        return ComplianceSummaryDTO.builder()
                .complianceScore(complianceScore)
                .activeChecks(totalChecks)
                .actionRequired(actionRequiredCount)
                .reportsGenerated((int) compliantCount)
                .build();
    }

    public RiskAnalysisDTO getRiskMetricsByClient(Long clientId) {
        log.debug("Calculating risk analysis metrics for client: {}", clientId);

        List<PortfolioHoldingDTO> holdings;
        PortfolioSummaryResponseDTO summary = null;

        try {
            // UPDATED: Two-step fetch to bypass the routing conflict
            Long portfolioId = portfolioClient.getPortfolioIdByClientId(clientId);
            holdings = portfolioClient.getPortfolioHoldings(portfolioId);

            summary = portfolioClient.getPortfolioSummaryByClientId(clientId);
        } catch (Exception e) {
            log.error("Failed to fetch from Portfolio service: {}", e.getMessage());
            throw new ComplianceCalculationException("Risk Metrics", "Portfolio holdings must be provided and non-empty");
        }

        if (holdings == null || holdings.isEmpty()) {
            throw new ComplianceCalculationException("Risk Metrics", "Portfolio holdings must be provided and non-empty");
        }

        double cashBalance = (summary != null) ? summary.getCashBalance() : 0.0;
        double totalInvestedValue = holdings.stream().mapToDouble(PortfolioHoldingDTO::getAssetValue).sum();
        double totalPortfolioValue = totalInvestedValue + cashBalance;

        if (totalPortfolioValue <= 0) {
            throw new ComplianceCalculationException("Risk Metrics", "Total portfolio value must be greater than zero");
        }

        double largestAssetValue = holdings.stream().mapToDouble(PortfolioHoldingDTO::getAssetValue).max().orElse(0);

        Map<String, Double> sectorSums = holdings.stream().collect(Collectors.groupingBy(
                h -> h.getSectorName() != null ? h.getSectorName() : "Unknown",
                Collectors.summingDouble(PortfolioHoldingDTO::getAssetValue)
        ));
        double largestSectorValue = sectorSums.values().stream().mapToDouble(Double::doubleValue).max().orElse(0);

        double totalDebt = holdings.stream().filter(h -> {
            String type = h.getAssetType() != null ? h.getAssetType().toLowerCase() : "";
            String name = h.getAssetName() != null ? h.getAssetName().toLowerCase() : "";
            return h.isDebt() || type.contains("debt") || type.contains("margin") || type.contains("loan")
                    || name.contains("debt") || name.contains("margin") || name.contains("loan");
        }).mapToDouble(PortfolioHoldingDTO::getAssetValue).sum();

        double totalEquity = totalPortfolioValue - totalDebt;

        if (totalEquity <= 0) {
            throw new ComplianceCalculationException("Leverage Ratio", "Total equity must be greater than zero");
        }

        double singleAssetExposure = (largestAssetValue / totalPortfolioValue) * 100;
        double sectorConcentration = (largestSectorValue / totalPortfolioValue) * 100;
        double leverageRatio = totalDebt / totalEquity;
        double liquidityCoverage = (cashBalance / totalPortfolioValue) * 100;

        return RiskAnalysisDTO.builder()
                .singleAssetExposure(Math.round(singleAssetExposure * 100.0) / 100.0)
                .sectorConcentration(Math.round(sectorConcentration * 100.0) / 100.0)
                .leverageRatio(Math.round(leverageRatio * 100.0) / 100.0)
                .liquidityCoverage(Math.round(liquidityCoverage * 100.0) / 100.0)
                .build();
    }

    @Transactional
    public List<ComplianceAuditLog> runFullComplianceAudit(Long clientId) {
        log.info("🔍 Starting full compliance audit for clientId: {}", clientId);
        List<ComplianceAuditLog> generatedLogs = new ArrayList<>();

        try {
            // UPDATED: Two-step fetch to bypass the routing conflict
            Long portfolioId = portfolioClient.getPortfolioIdByClientId(clientId);
            List<PortfolioHoldingDTO> holdings = portfolioClient.getPortfolioHoldings(portfolioId);

            ClientDataDTO clientData = clientClient.getClientData(clientId);
            PortfolioSummaryResponseDTO summary = null;
            try {
                summary = portfolioClient.getPortfolioSummaryByClientId(clientId);
            } catch (Exception e) {
                log.warn("Summary fetch failed, defaulting cash to 0.");
            }

            if (holdings == null || holdings.isEmpty() || clientData == null) {
                throw new ComplianceCalculationException("Compliance Audit", "Missing required portfolio or client data");
            }

            double cashBalance = (summary != null) ? summary.getCashBalance() : 0.0;
            double totalInvestedValue = holdings.stream().mapToDouble(PortfolioHoldingDTO::getAssetValue).sum();
            double totalValue = totalInvestedValue + cashBalance;

            if (totalValue <= 0) {
                throw new ComplianceCalculationException("Compliance Audit", "Total portfolio value must be greater than zero");
            }

            LocalDate today = LocalDate.now();

            // RULE 1: KYC STATUS CHECK
            boolean kycFail = clientData.getKycStatus() == null || "Pending".equalsIgnoreCase(clientData.getKycStatus()) || "Rejected".equalsIgnoreCase(clientData.getKycStatus());
            generatedLogs.add(ComplianceAuditLog.builder()
                    .clientId(clientId).reviewType("KYC Verification").regulation("KYC Guidelines").status(!kycFail)
                    .findings(kycFail ? "Client KYC status is pending; required digital documents are unverified." : "Client KYC is fully verified.")
                    .reviewDate(today).nextReview(today.plusDays(7)).build());

            // ═════════════════════════════════════════════════════════════════════════
            // RULE 2: RISK ASSESSMENT (RISK POLICY)
            // ═════════════════════════════════════════════════════════════════════════
            // Calculate the actual weighted risk of what they own
            double weightedAvgRisk = holdings.stream()
                    .mapToDouble(h -> h.getAssetValue() * h.getRiskScore())
                    .sum() / totalValue;

            // Translate the text string into a numerical limit
            double maxAllowedRisk = 5.0; // Safe default
            String profileText = clientData.getRiskProfile();

            if (profileText != null) {
                String p = profileText.toLowerCase();
                if (p.contains("conservative") || p.contains("low")) {
                    maxAllowedRisk = 4.0;
                } else if (p.contains("moderate") || p.contains("balanced")) {
                    maxAllowedRisk = 6.5; // Fits your UI's 6/10 tolerance score
                } else if (p.contains("aggressive") || p.contains("high")) {
                    maxAllowedRisk = 9.0;
                }
            }

            // Fail if actual risk is higher than allowed risk
            boolean riskFail = weightedAvgRisk > maxAllowedRisk;

            String riskFinding = riskFail
                    ? String.format("Average holdings risk score (%.1f) exceeds the client's declared limit (%.1f).", weightedAvgRisk, maxAllowedRisk)
                    : String.format("Average holdings risk score (%.1f) is within the client's declared limit.", weightedAvgRisk);

            generatedLogs.add(ComplianceAuditLog.builder()
                    .clientId(clientId)
                    .reviewType("Risk Assessment")
                    .regulation("Risk Policy")
                    .status(!riskFail)
                    .findings(riskFinding)
                    .reviewDate(today)
                    .nextReview(today.plusDays(30))
                    .build());

            // RULE 3: SINGLE HOLDING CONCENTRATION CHECK (40% Limit)
            boolean limitFail = false;
            String limitFinding = "No single holding exceeds the maximum allowed allocation percentage limit.";
            for (PortfolioHoldingDTO holding : holdings) {
                double concentration = (holding.getAssetValue() / totalValue) * 100;
                if (concentration > 40.0) {
                    limitFail = true;
                    limitFinding = String.format("Holding in %s is at %.2f%%, exceeding the maximum allowed allocation percentage limit.", holding.getAssetName(), concentration);
                    break;
                }
            }
            generatedLogs.add(ComplianceAuditLog.builder()
                    .clientId(clientId).reviewType("Investment Limits").regulation("Exposure Limit").status(!limitFail)
                    .findings(limitFinding).reviewDate(today).nextReview(today.plusDays(30)).build());

            // ═════════════════════════════════════════════════════════════════════════
            // RULE 4: ASSET ALLOCATION (DIVERSIFICATION)
            // ═════════════════════════════════════════════════════════════════════════
            // Group holdings by AssetType (e.g., Equity, Bond, Mutual Fund)
            Map<String, Double> assetTypeConcentration = holdings.stream()
                    .collect(Collectors.groupingBy(
                            h -> h.getAssetType() != null ? h.getAssetType() : "Unknown",
                            Collectors.summingDouble(PortfolioHoldingDTO::getAssetValue)
                    ));

            boolean divFail = false;
            String divFinding = "Portfolio is properly diversified across multiple asset classes.";

            // Check 1: Do they only have 1 type of investment? (e.g., ONLY Bonds)
            if (assetTypeConcentration.size() < 2) {
                divFail = true;
                String onlyType = assetTypeConcentration.keySet().stream().findFirst().orElse("one asset class");
                divFinding = String.format("Portfolio lacks diversification; currently concentrated in a single asset class (%s).", onlyType);
            } else {
                // Check 2: Does any single asset type exceed an unhealthy extreme (e.g., > 75%)?
                for (Map.Entry<String, Double> entry : assetTypeConcentration.entrySet()) {
                    double concentration = (entry.getValue() / totalValue) * 100;
                    if (concentration > 75.0) {
                        divFail = true;
                        divFinding = String.format("Portfolio lacks diversification; heavily concentrated in %s (%.1f%%).", entry.getKey(), concentration);
                        break;
                    }
                }
            }

            generatedLogs.add(ComplianceAuditLog.builder()
                    .clientId(clientId)
                    .reviewType("Asset Allocation")
                    .regulation("Diversification Rule")
                    .status(!divFail)
                    .findings(divFinding)
                    .reviewDate(today)
                    .nextReview(today.plusDays(30))
                    .build());


            // RULE 5: FINANCIAL GOALS VALIDATION
            boolean goalsFail = clientData.getInvestmentGoal() == null || clientData.getInvestmentGoal().trim().isEmpty();
            generatedLogs.add(ComplianceAuditLog.builder()
                    .clientId(clientId).reviewType("Profile Audit").regulation("Financial Goals Check").status(!goalsFail)
                    .findings(goalsFail ? "Client financial goals are missing or undefined in the current profile." : "Client has valid financial goals mapped to their current holdings.")
                    .reviewDate(today).nextReview(today.plusMonths(6)).build());

            // Wipe the slate clean before saving to prevent stacking old data!
            auditLogRepository.deleteByClientId(clientId);

            return auditLogRepository.saveAll(generatedLogs);

        } catch (Exception e) {
            log.error("💥 Error during compliance audit for clientId {}: {}", clientId, e.getMessage(), e);
            throw new ComplianceCalculationException("Compliance Audit", "Failed to connect to external services or process audit.");
        }
    }

    // --- STANDARD CRUD ---
    public List<ComplianceAuditLog> getAllAuditLogs() { return auditLogRepository.findAllByOrderByReviewDateDesc(); }
    public List<ComplianceAuditLog> getAuditLogsByClientId(Long clientId) { return auditLogRepository.findByClientIdOrderByIdDesc(clientId); }
    public ComplianceAuditLog getAuditLogById(Long id) { return auditLogRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("ComplianceAuditLog", id)); }
    public List<ComplianceAuditLog> getLogsRequiringAction() { return auditLogRepository.findByStatusFalse(); }
    public List<ComplianceAuditLog> getUpcomingReviews() { return auditLogRepository.findByNextReviewBefore(LocalDate.now().plusDays(30)); }
    @Transactional public ComplianceAuditLog createAuditLog(ComplianceAuditLog auditLog) { return auditLogRepository.save(auditLog); }
    @Transactional public List<ComplianceAuditLog> createBulkAuditLogs(List<ComplianceAuditLog> auditLogs) { return auditLogRepository.saveAll(auditLogs); }
    @Transactional public ComplianceAuditLog updateAuditLog(Long id, ComplianceAuditLog auditLog) {
        if (!auditLogRepository.existsById(id)) throw new ResourceNotFoundException("ComplianceAuditLog", id);
        auditLog.setId(id);
        return auditLogRepository.save(auditLog);
    }
    @Transactional public void deleteAuditLog(Long id) {
        if (!auditLogRepository.existsById(id)) throw new ResourceNotFoundException("ComplianceAuditLog", id);
        auditLogRepository.deleteById(id);
    }
}