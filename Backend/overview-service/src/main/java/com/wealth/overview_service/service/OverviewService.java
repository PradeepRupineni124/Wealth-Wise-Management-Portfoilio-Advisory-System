package com.wealth.overview_service.service;

import com.wealth.overview_service.clients.ClientServiceClient;
import com.wealth.overview_service.clients.PortfolioClient;
import com.wealth.overview_service.dto.ChartDataDto;
import com.wealth.overview_service.dto.ClientDTO;
import com.wealth.overview_service.dto.OverviewDto;
import com.wealth.overview_service.provider.MockDashboardProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.wealth.overview_service.dto.PortfolioSummaryResponse;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
@Slf4j
public class OverviewService {

    private final PortfolioClient portfolioClient;
    private final ClientServiceClient clientServiceClient; // <-- Inject Client Client

    public OverviewDto getClientDashboard(Long clientId) {
        OverviewDto overview = new OverviewDto();

        // --- 1. FETCH REAL CLIENT DETAILS (New Code) ---
        try {
            ClientDTO clientProfile = clientServiceClient.getClientProfile(clientId);

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
        try {
            PortfolioSummaryResponse portfolioData = portfolioClient.getPortfolioSummary(clientId);

            if (portfolioData != null) {
                overview.setTotalPortfolioValue(portfolioData.getTotalValue() != null ? portfolioData.getTotalValue() : 0.0);
                overview.setTotalValueChange(portfolioData.getTotalValueChange() != null ? portfolioData.getTotalValueChange() : 0.0);
                overview.setAnnualReturnPercentage(portfolioData.getAnnualReturnPercentage() != null ? portfolioData.getAnnualReturnPercentage() : 0.0);
                overview.setRiskScore(portfolioData.getRiskScore() != null ? portfolioData.getRiskScore() : 0.0);
                overview.setActiveInvestmentsCount(portfolioData.getActiveInvestmentsCount() != null ? portfolioData.getActiveInvestmentsCount() : 0);

                if (portfolioData.getAssetAllocations() != null) {
                    overview.setAssetAllocation(portfolioData.getAssetAllocations());
                } else {
                    overview.setAssetAllocation(new ArrayList<>());
                }
            }
        } catch (Exception e) {
            log.error("Failed to fetch Portfolio Data: {}", e.getMessage());
            setEmptyPortfolioDefaults(overview);
        }

        // 3. Mock Data (Activities/Notifications) - To be replaced by Activity-Service later
        overview.setRecentActivities(new ArrayList<>());
        overview.setNotifications(new ArrayList<>());

        return overview;
    }

    private void setEmptyPortfolioDefaults(OverviewDto overview) {
        overview.setTotalPortfolioValue(0.0);
        overview.setTotalValueChange(0.0);
        overview.setAnnualReturnPercentage(0.0);
        overview.setRiskScore(0.0);
        overview.setActiveInvestmentsCount(0);
        overview.setAssetAllocation(new ArrayList<>());
    }
}
