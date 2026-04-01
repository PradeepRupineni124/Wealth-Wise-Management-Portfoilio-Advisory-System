package com.wealth.overview_service.provider;


import com.wealth.overview_service.dto.*;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class MockDashboardProvider {

    public OverviewDto getMockDashboardData(Long clientId) {
        OverviewDto overview = new OverviewDto();
        boolean isRichClient = (clientId % 2 == 0);

        overview.setClientName(isRichClient ? "Akhil Kiran" : "Ganesh");
        overview.setAdvisorName("John Anderson");
        overview.setTotalPortfolioValue(isRichClient ? 2500000.00 : 1123456.00);
        overview.setTotalValueChange(isRichClient ? 150000.00 : 48309.00);
        overview.setAnnualReturnPercentage(isRichClient ? 8.5 : 5.7);
        overview.setRiskScore(isRichClient ? 6.5 : 1.5);
        overview.setActiveInvestmentsCount(isRichClient ? 45 : 22);

        overview.setAssetAllocation(Arrays.asList(
                new AssetAllocationDTO("Equities", 1146551.0, 45.0),
                new AssetAllocationDTO("Bonds", 764368.0, 30.0),
                new AssetAllocationDTO("Mutual Funds", 636973.0, 25.0)
        ));

        overview.setRecentActivities(Arrays.asList(
                new ActivityDTO("1", "Kiran", "TSLA", "1 day ago", "$15,000", "completed", "buy"),
                new ActivityDTO("2", "Akhil", "MSFT", "2 days ago", "$1,250", "received", "dividend"),
                new ActivityDTO("3", "Google", "GOOGL", "3 days ago", "$5,000", "pending", "buy")
        ));

        overview.setNotifications(Arrays.asList(
                new NotificationDto("1", "Portfolio Rebalanced", "Automatic rebalancing complete.", "Today at 9:30 AM", "success"),
                new NotificationDto("2", "Advisory", "Tech sector exposure is high.", "Yesterday", "info")
        ));

        return overview;
    }

    public ChartDataDto getMockChartData(Long clientId, String range) {
        List<String> labels;
        List<Double> values;
        double multiplier = 0.5 + ((clientId * 7) % 10) / 10.0;

        switch (range) {
            case "1Y":
                labels = Arrays.asList("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
                values = Arrays.asList(1.9, 2.1, 2.0, 2.3, 2.4, 2.6, 2.7, 2.7, 2.8, 2.9, 3.1, 3.2);
                break;
            case "All":
                labels = Arrays.asList("2020", "2021", "2022", "2023", "2024", "2025");
                values = Arrays.asList(1.2, 1.5, 1.8, 2.1, 2.4, 2.6);
                break;
            case "6M":
            default:
                labels = Arrays.asList("Jan", "Feb", "Mar", "Apr", "May", "Jun");
                values = Arrays.asList(1.95, 2.1, 2.05, 2.3, 2.45, 2.6);
                break;
        }

        List<Double> scaledValues = values.stream().map(v -> v * 1000000 * multiplier).toList();
        return new ChartDataDto(labels, scaledValues);
    }
}
