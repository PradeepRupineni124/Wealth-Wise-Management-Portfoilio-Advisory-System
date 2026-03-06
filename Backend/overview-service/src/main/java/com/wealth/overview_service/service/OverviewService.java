package com.wealth.overview_service.service;

//import com.wealth.overview_service.clients.ClientServiceClient;
//import com.wealth.overview_service.clients.PortfolioClient;
import com.wealth.overview_service.dto.ChartDataDto;
import com.wealth.overview_service.dto.ClientDTO;
import com.wealth.overview_service.dto.OverviewDto;
import com.wealth.overview_service.dto.StatCardDTO;
import com.wealth.overview_service.dto.AssetAllocationDTO;
import com.wealth.overview_service.dto.AssetClassDTO;
import com.wealth.overview_service.dto.HoldingDTO;
import com.wealth.overview_service.dto.ActivityDTO;
import com.wealth.overview_service.provider.MockDashboardProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.wealth.overview_service.dto.PortfolioSummaryResponse;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OverviewService {

//    private final PortfolioClient portfolioClient;
//    private final ClientServiceClient clientServiceClient; // <-- Inject Client Client

    private final RemoteIntegrationService integrationService;

    public OverviewDto getClientDashboard(Long clientId) {
        OverviewDto overview = new OverviewDto();

        // --- 1. FETCH REAL CLIENT DETAILS (New Code) ---
        try {
            ClientDTO clientProfile = integrationService.getClientProfileSafely(clientId);

            // Set the real name from the database!
            overview.setClientName(clientProfile.getFullName());

            // For Advisor Name, you might need an AdvisorService,
            // but for now, we can leave it generic or fetch it if ClientDTO has it.
            overview.setAdvisorName("My Advisor");

        } catch (Exception e) {
            log.error("Failed to fetch Client Profile for ID {}: {}", clientId, e.getMessage());
            // Fallback if Client-Service is down
            overview.setClientName("Client " + clientId);
            overview.setAdvisorName("Advisor");
        }

        // --- 2. FETCH PORTFOLIO DATA (Existing Code) ---
        PortfolioSummaryResponse summary = null;
        try {
             summary = integrationService.getPortfolioSummarySafely(clientId);

            if (summary != null) {
                // --- A. Grab the Top Cards ---
                if (summary.getStats() != null) {
                    for (StatCardDTO stat : summary.getStats()) {
                        if ("Total Portfolio Value".equals(stat.getTitle())) {
                            overview.setTotalPortfolioValue(cleanStringToNumber(stat.getValue()));
                        } else if ("Total Return".equals(stat.getTitle())) {
                            overview.setAnnualReturnPercentage(cleanStringToNumber(stat.getValue()));
                        } else if ("Total Positions".equals(stat.getTitle())) {
                            overview.setActiveInvestmentsCount(cleanStringToNumber(stat.getValue()).intValue());
                        }
                    }
                }

                // --- B. Fix Asset Allocation (Include Cash!) ---
                List<AssetAllocationDTO> allocations = new ArrayList<>();
                double totalCalculatedValue = 0.0;
                double equityPercentage = 0.0;

                // 1. Calculate the absolute total value first
                if (summary.getAssetClasses() != null) {
                    for (AssetClassDTO ac : summary.getAssetClasses()) {
                        totalCalculatedValue += cleanStringToNumber(ac.getValue());
                    }
                }
                Double cashVal = summary.getCashBalance() != null ? summary.getCashBalance().doubleValue() : 0.0;
                Double totalVal = totalCalculatedValue + cashVal;

                // 2. Recalculate ALL percentages dynamically to exactly 1 decimal place
                if (totalVal > 0) {
                    if (summary.getAssetClasses() != null) {
                        for (AssetClassDTO ac : summary.getAssetClasses()) {
                            Double val = cleanStringToNumber(ac.getValue());

                            if (val > 0) {
                                // Math trick: multiply by 1000, round, divide by 10 to get 1 decimal (e.g., 1.4)
                                Double roundedPct = Math.round((val / totalVal) * 1000.0) / 10.0;
                                allocations.add(new AssetAllocationDTO(ac.getTitle(), val, roundedPct));

                                if ("Equities".equalsIgnoreCase(ac.getTitle())) {
                                    equityPercentage = roundedPct;
                                }
                            }
                        }
                    }

                    // 3. Calculate Cash percentage perfectly
                    if (cashVal > 0) {
                        Double roundedCashPct = Math.round((cashVal / totalVal) * 1000.0) / 10.0;
                        allocations.add(new AssetAllocationDTO("Cash", cashVal, roundedCashPct));
                    }
                }
                overview.setAssetAllocation(allocations);

                // --- C. Fix Risk Score (Calculate based on Equity exposure) ---
                // If they have 80% equities, risk is higher. If 10% equities, risk is lower.
                double derivedRisk = 3.0 + (equityPercentage / 100.0) * 6.0; // Scales 3.0 to 9.0
                overview.setRiskScore(Math.round(derivedRisk * 10.0) / 10.0);

                // --- D. Grab Recent Activities ---
                if (summary.getPortfolioId() != null) {
                    List<HoldingDTO> holdings = integrationService.getPortfolioHoldingsSafely(summary.getPortfolioId());
                    if (holdings != null) {
                        overview.setRecentActivities(mapHoldingsToActivities(holdings));
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to fetch Portfolio Data: {}", e.getMessage());
            overview.setAssetAllocation(new ArrayList<>());
            overview.setRecentActivities(new ArrayList<>());
            overview.setRiskScore(5.0); // Safe fallback
        }

        List<com.wealth.overview_service.dto.NotificationDto> allNotifications = new ArrayList<>();

        // Optional: Add an internal success notification
        allNotifications.add(new com.wealth.overview_service.dto.NotificationDto("1", "Portfolio Rebalanced", "Your portfolio has been automatically rebalanced according to your risk profile.", "Today", "SUCCESS"));

        // A. Fetch Advisory Alerts (Needs Portfolio ID)
        if (summary != null && summary.getPortfolioId() != null) {
            allNotifications.addAll(integrationService.getAdvisoryNotificationsSafely(summary.getPortfolioId()));
        }

        // B. Fetch Compliance Alerts (Needs Client ID)
        allNotifications.addAll(integrationService.getComplianceNotificationsSafely(clientId));

        // Finally, attach them to the overview object
        overview.setNotifications(allNotifications);

        return overview;
    }

    // --- HELPER METHODS ---

    // Strips out $, %, and commas so Angular gets pure numbers
    private Double cleanStringToNumber(String formattedString) {
        if (formattedString == null || formattedString.isEmpty()) return 0.0;
        try {
            String clean = formattedString.replaceAll("[^\\d.-]", "");
            return Double.parseDouble(clean);
        } catch (Exception e) {
            return 0.0;
        }
    }

    // Converts real DB holdings into a "Recent Activity" timeline
    private List<ActivityDTO> mapHoldingsToActivities(List<HoldingDTO> holdings) {
        return holdings.stream()
                .filter(h -> h.getAddedDate() != null)
                .sorted((h1, h2) -> h2.getAddedDate().compareTo(h1.getAddedDate()))
                .limit(4)
                .map(h -> {
                    BigDecimal qty = h.getQty() != null ? h.getQty() : BigDecimal.ZERO;
                    BigDecimal avgPrice = h.getAvgPrice() != null ? h.getAvgPrice() : BigDecimal.ZERO;
                    BigDecimal totalSpent = qty.multiply(avgPrice);

                    return new ActivityDTO(
                            h.getHoldingId() != null ? h.getHoldingId().toString() : "0",
                            h.getName() != null ? h.getName() : "Unknown Asset",
                            h.getSymbol() != null ? h.getSymbol() : "N/A",
                            h.getAddedDate().toLocalDate().toString(),
                            // Guarantee string formatting is strictly a currency string
                            "$" + String.format("%,.2f", totalSpent),
                            "completed",
                            "buy"
                    );
                })
                .collect(Collectors.toList());
    }


    public ChartDataDto getChartData(Long clientId, String range) {
        List<String> labels;
        List<Double> values;

        // Mock Logic: In a real app, you would fetch this from a 'History-Service' or Database
        switch (range) {
            case "1M":
                labels = Arrays.asList("Week 1", "Week 2", "Week 3", "Week 4");
                values = Arrays.asList(50000.0, 51200.0, 50800.0, 52000.0);
                break;
            case "1Y":
                labels = Arrays.asList("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
                values = Arrays.asList(45000.0, 46000.0, 48000.0, 47500.0, 50000.0, 52000.0, 51000.0, 53000.0, 55000.0, 56000.0, 58000.0, 60000.0);
                break;
            case "All":
                labels = Arrays.asList("2021","2022", "2023", "2024", "2025");
                values = Arrays.asList(28000.0, 34000.0, 55000.0, 45000.0, 52000.0);
                break;
            case "6M":
            default:
                labels = Arrays.asList("Jan", "Feb", "Mar", "Apr", "May", "Jun");
                values = Arrays.asList(45000.0, 47000.0, 46500.0, 48000.0, 50000.0, 52000.0);
                break;
        }

        return new ChartDataDto(labels, values);
    }
}


//    private void setEmptyPortfolioDefaults(OverviewDto overview) {
//        overview.setTotalPortfolioValue(2345670.0);
//        overview.setTotalValueChange(876589.0);
//        overview.setAnnualReturnPercentage(54.0);
//        overview.setRiskScore(5.7);
//        overview.setActiveInvestmentsCount(55);
//        overview.setAssetAllocation(new ArrayList<>());
//    }

