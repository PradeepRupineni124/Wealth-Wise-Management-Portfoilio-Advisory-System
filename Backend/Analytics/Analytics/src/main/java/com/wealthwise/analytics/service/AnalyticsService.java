package com.wealthwise.analytics.service;

import com.wealthwise.analytics.client.PortfolioFeignClient;
import com.wealthwise.analytics.dto.*;
import com.wealthwise.analytics.exception.PortfolioDataUnavailableException;
import com.wealthwise.analytics.util.FinancialCalculator;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final PortfolioFeignClient portfolioClient;
    private final FinancialCalculator financialCalculator;

    private static final Double RISK_FREE_RATE = 0.04;
    private static final Double MARKET_RETURN = 0.10;
    private static final Double MARKET_VARIANCE = 0.05;
    private static final Double BENCHMARK_VOLATILITY = 0.15;
    private static final Double BENCHMARK_SHARPE_RATIO = 0.5;
    private static final Double BENCHMARK_BETA = 1.0;
    private static final Double BENCHMARK_MAX_DRAWDOWN = -25.0;

    // 2D ARRAY OF CURATED PERSONAS
    private static final Double[][] MOCK_RETURNS_POOL = {
            {0.012, 0.015, -0.005, 0.018, 0.011, 0.014, 0.010},
            {0.047, 0.045, -0.015, 0.054, 0.042, 0.048, 0.035},
            {0.085, -0.040, 0.060, 0.095, -0.055, 0.070, 0.020},
            {0.020, -0.010, -0.025, 0.015, 0.030, -0.005, -0.010}
    };

    private static final Double[] DEMO_MULTIPLIERS = {0.92, 0.78, 0.65, 0.98};

    // Benchmark returns for the line chart comparison
    private static final List<Double> BENCHMARK_CHART_RETURNS = Arrays.asList(1.5, 2.1, 2.8, 2.9, 2.3, 2.6, 1.8);

    public AnalyticsService(PortfolioFeignClient portfolioClient, FinancialCalculator financialCalculator) {
        this.portfolioClient = portfolioClient;
        this.financialCalculator = financialCalculator;
    }

    public AnalyticsDashboardDTO getDashboard(String clientId) {
        try {
            Long parsedClientId = Long.valueOf(clientId);

            PortfolioFeignClient.PortfolioSummaryDTO summary = portfolioClient.getPortfolioSummary(parsedClientId);
            List<PortfolioFeignClient.HoldingDTO> holdings = portfolioClient.getPortfolioHoldings(summary.portfolioId());

            boolean hasHoldings = !holdings.isEmpty();

            int personaIndex = (int) (parsedClientId % MOCK_RETURNS_POOL.length);
            Double[] clientMonthlyReturns = MOCK_RETURNS_POOL[personaIndex];
            Double demoMultiplier = DEMO_MULTIPLIERS[personaIndex];

            double cashBalance = summary.cashBalance() != null ? summary.cashBalance().doubleValue() : 0.0;
            double totalMarketValue = holdings.stream()
                    .mapToDouble(h -> h.marketValue() != null ? h.marketValue().doubleValue() : 0.0)
                    .sum();
            double totalBuyValue = holdings.stream()
                    .mapToDouble(h -> (h.qty() != null && h.avgPrice() != null) ?
                            h.qty().multiply(h.avgPrice()).doubleValue() : 0.0)
                    .sum();

            Double currentValue = cashBalance + totalMarketValue;
            Double beginningValue = hasHoldings ? (cashBalance + totalBuyValue) * demoMultiplier : cashBalance;

            // --- KEY METRICS ---
            Double totalReturnYTD = financialCalculator.calculateTotalReturnYTD(currentValue, beginningValue);
            Double standardDeviation = hasHoldings ? financialCalculator.calculateStandardDeviation(clientMonthlyReturns) : 0.0;
            Double avgMonthlyReturn = hasHoldings ? Arrays.stream(clientMonthlyReturns).mapToDouble(Double::doubleValue).average().orElse(0.0) * 12 : 0.0;
            Double sharpeRatio = hasHoldings ? financialCalculator.calculateSharpeRatio(avgMonthlyReturn, RISK_FREE_RATE, standardDeviation) : 0.0;
            Double beta = hasHoldings ? financialCalculator.calculateBeta(0.08, MARKET_VARIANCE) : 0.0;
            Double alpha = hasHoldings ? financialCalculator.calculateAlpha(avgMonthlyReturn, RISK_FREE_RATE, beta, MARKET_RETURN) : 0.0;

            // --- GRAPH 1: LINE CHART DATA GENERATION ---
            List<String> historicalLabels = new ArrayList<>();
            LocalDate now = LocalDate.now();
            for (int i = 6; i >= 0; i--) {
                historicalLabels.add(now.minusMonths(i).getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH));
            }

            List<Double> portfolioChartReturns = hasHoldings
                    ? Arrays.stream(clientMonthlyReturns)
                    .map(r -> Math.round((r * 100) * 100.0) / 100.0)
                    .collect(Collectors.toList())
                    : Arrays.asList(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);

            PerformanceData performanceData = new PerformanceData(
                    totalReturnYTD, sharpeRatio, beta, alpha, standardDeviation,
                    historicalLabels, portfolioChartReturns, BENCHMARK_CHART_RETURNS
            );

            // --- GRAPH 2: ASSET METRICS DATA GENERATION ---
            double equitiesValue = totalMarketValue * 0.75;
            double fixedIncomeValue = totalMarketValue * 0.25;

            List<AssetMetric> assetMetrics = Arrays.asList(
                    new AssetMetric("Equities", equitiesValue, hasHoldings ? (totalReturnYTD > 0 ? Math.round((totalReturnYTD + 2.5) * 100.0) / 100.0 : Math.round((totalReturnYTD - 1.5) * 100.0) / 100.0) : 0.0),
                    new AssetMetric("Fixed Income", fixedIncomeValue, hasHoldings ? 4.2 : 0.0),
                    new AssetMetric("Cash/Equivalents", cashBalance, 1.5)
            );

            Map<String, Double> dynamicSectors = holdings.stream()
                    .filter(h -> h.sector() != null && !h.sector().isEmpty())
                    .collect(Collectors.groupingBy(PortfolioFeignClient.HoldingDTO::sector, Collectors.summingDouble(h -> h.allocationPct() != null ? h.allocationPct().doubleValue() : 0.0)));

            List<Sector> sectors = dynamicSectors.entrySet().stream()
                    .map(entry -> {
                        // Just take the raw Double value directly
                        double rawPct = entry.getValue();
                        double dollarValue = currentValue * (rawPct / 100.0);
                        return new Sector(entry.getKey(), rawPct, dollarValue);
                    })
                    .collect(Collectors.toList());

// Sum the raw values
            double totalAllocatedPct = sectors.stream().mapToDouble(Sector::value).sum();

// Check if it's less than 100 (using 99.99 to avoid floating point bugs)
            if (totalAllocatedPct < 99.99) {
                double remainingPct = 100.0 - totalAllocatedPct; // No rounding here either
                double cashDollarValue = currentValue * (remainingPct / 100.0);
                sectors.add(new Sector("Cash & Unclassified", remainingPct, cashDollarValue));
            }

            Map<String, Double> geoAllocations = holdings.stream()
                    .filter(h -> h.geography() != null && !h.geography().isEmpty())
                    .collect(Collectors.groupingBy(PortfolioFeignClient.HoldingDTO::geography, Collectors.summingDouble(h -> h.allocationPct() != null ? h.allocationPct().doubleValue() : 0.0)));

            List<Geography> geoData = geoAllocations.entrySet().stream()
                    .map(entry -> {
                        int roundedPct = (int) Math.round(entry.getValue());
                        String color = entry.getKey().equalsIgnoreCase("North America") ? "bg-blue" : entry.getKey().equalsIgnoreCase("Europe") ? "bg-green" : entry.getKey().equalsIgnoreCase("Asia") ? "bg-yellow" : "bg-purple";
                        return new Geography(entry.getKey(), (double) roundedPct, color);
                    })
                    .collect(Collectors.toList());

            List<KeyMetric> keyMetrics = Arrays.asList(
                    new KeyMetric("Total Return", totalReturnYTD, "%", 2.5, totalReturnYTD >= 0 ? "UP" : "DOWN"),
                    new KeyMetric("Sharpe Ratio", sharpeRatio, "", 0.5, sharpeRatio >= BENCHMARK_SHARPE_RATIO ? "UP" : "DOWN"),
                    new KeyMetric("Beta", beta, "", -0.05, beta < BENCHMARK_BETA ? "DOWN" : "UP"),
                    new KeyMetric("Alpha", alpha, "%", 1.2, alpha > 0 ? "UP" : "DOWN")
            );

            return new AnalyticsDashboardDTO(clientId, currentValue, performanceData, sectors, geoData, keyMetrics, assetMetrics, LocalDateTime.now());

        } catch (Exception ex) {
            // NEW FALLBACK LOGIC: Safely catch the 404/503 errors and return empty data
            System.err.println("⚠️ PORTFOLIO SERVICE UNAVAILABLE OR EMPTY for Client " + clientId + ". Generating empty dashboard.");
            return createEmptyDashboard(clientId);
        }
    }

    public RiskAnalysisDTO getRiskAnalysis(String clientId) {
        try {
            Long parsedClientId = Long.valueOf(clientId);

            PortfolioFeignClient.PortfolioSummaryDTO summary = portfolioClient.getPortfolioSummary(parsedClientId);
            List<PortfolioFeignClient.HoldingDTO> holdings = portfolioClient.getPortfolioHoldings(summary.portfolioId());

            boolean hasHoldings = !holdings.isEmpty();

            // --- SELECT THE PERSONA BASED ON CLIENT ID ---
            int personaIndex = (int) (parsedClientId % MOCK_RETURNS_POOL.length);
            Double[] clientMonthlyReturns = MOCK_RETURNS_POOL[personaIndex];

            double cashBalance = summary.cashBalance() != null ? summary.cashBalance().doubleValue() : 0.0;
            double totalMarketValue = holdings.stream()
                    .mapToDouble(h -> h.marketValue() != null ? h.marketValue().doubleValue() : 0.0)
                    .sum();
            Double currentValue = cashBalance + totalMarketValue;

            // --- CONDITIONAL RISK CALCULATIONS USING PERSONA ARRAY ---
            Double volatility = hasHoldings ? financialCalculator.calculateStandardDeviation(clientMonthlyReturns) : 0.0;
            Double avgMonthlyReturn = hasHoldings ? Arrays.stream(clientMonthlyReturns).mapToDouble(Double::doubleValue).average().orElse(0.0) * 12 : 0.0;

            Double sharpeRatio = hasHoldings ? financialCalculator.calculateSharpeRatio(avgMonthlyReturn, RISK_FREE_RATE, volatility) : 0.0;
            Double beta = hasHoldings ? financialCalculator.calculateBeta(0.08, MARKET_VARIANCE) : 0.0;
            Double maxDrawdown = hasHoldings ? financialCalculator.calculateMaxDrawdown(clientMonthlyReturns) : 0.0;

            Double var95_1Day = hasHoldings ? financialCalculator.calculateVaR95(currentValue, volatility, 1) : 0.0;
            Double var95_1Month = hasHoldings ? financialCalculator.calculateVaR95(currentValue, volatility, 30) : 0.0;

            RiskAdjustedMetrics riskMetrics = new RiskAdjustedMetrics(
                    new MetricComparison(volatility * 100, BENCHMARK_VOLATILITY * 100),
                    new MetricComparison(sharpeRatio, BENCHMARK_SHARPE_RATIO),
                    new MetricComparison(beta, BENCHMARK_BETA),
                    new MetricComparison(maxDrawdown, BENCHMARK_MAX_DRAWDOWN)
            );

            ValueAtRisk valueAtRisk = new ValueAtRisk(
                    new VaRMetric(var95_1Day, currentValue > 0 ? (var95_1Day / currentValue) * 100 : 0.0),
                    new VaRMetric(var95_1Month, currentValue > 0 ? (var95_1Month / currentValue) * 100 : 0.0)
            );

            String riskLevel = hasHoldings ? financialCalculator.determineRiskLevel(volatility * 100, maxDrawdown, beta) : "Cash/Uninvested";
            String riskDesc = hasHoldings ? financialCalculator.getRiskDescription(riskLevel) : "Portfolio is currently held entirely in cash with no market exposure.";
            RiskAssessment riskAssessment = new RiskAssessment(riskLevel, riskDesc);

            return new RiskAnalysisDTO(clientId, riskMetrics, valueAtRisk, riskAssessment, LocalDateTime.now());

        } catch (Exception ex) {
            // NEW FALLBACK LOGIC: Safely catch the 404/503 errors and return empty data
            System.err.println("⚠️ PORTFOLIO SERVICE UNAVAILABLE OR EMPTY for Client " + clientId + ". Generating empty risk analysis.");
            return createEmptyRiskAnalysis(clientId);
        }
    }

    // =========================================================================
    // NEW HELPER METHODS: Safe, Empty DTO Builders to prevent UI crashes
    // =========================================================================

    private AnalyticsDashboardDTO createEmptyDashboard(String clientId) {

        // Generate historical labels safely
        List<String> historicalLabels = new ArrayList<>();
        LocalDate now = LocalDate.now();
        for (int i = 6; i >= 0; i--) {
            historicalLabels.add(now.minusMonths(i).getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH));
        }

        // Empty Performance Data
        PerformanceData emptyPerfData = new PerformanceData(
                0.0, 0.0, 0.0, 0.0, 0.0,
                historicalLabels,
                Arrays.asList(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0), // Empty portfolio line
                BENCHMARK_CHART_RETURNS // Still show the benchmark line
        );

        // Empty Sectors and Geographies
        List<Sector> emptySectors = Arrays.asList(new Sector("Cash & Uninvested", 100.0, 0.0));
        List<Geography> emptyGeoData = Arrays.asList(new Geography("Unclassified", 100.0, "bg-gray"));

        // Empty Asset Metrics
        List<AssetMetric> emptyAssetMetrics = Arrays.asList(
                new AssetMetric("Equities", 0.0, 0.0),
                new AssetMetric("Fixed Income", 0.0, 0.0),
                new AssetMetric("Cash/Equivalents", 0.0, 0.0)
        );

        // Empty Key Metrics
        List<KeyMetric> emptyKeyMetrics = Arrays.asList(
                new KeyMetric("Server Down", 0.0, "%", 0.0, "DOWN"),
                new KeyMetric("Server Down", 0.0, "", 0.0, "DOWN"),
                new KeyMetric("Server Down", 0.0, "", 0.0, "DOWN"),
                new KeyMetric("Server Down", 0.0, "%", 0.0, "DOWN")
        );

        // Return a beautifully zeroed-out dashboard
        return new AnalyticsDashboardDTO(clientId, 0.0, emptyPerfData, emptySectors, emptyGeoData, emptyKeyMetrics, emptyAssetMetrics, LocalDateTime.now());
    }

    private RiskAnalysisDTO createEmptyRiskAnalysis(String clientId) {

        // Empty Risk Metrics (0.0 vs the real benchmark data)
        RiskAdjustedMetrics emptyMetrics = new RiskAdjustedMetrics(
                new MetricComparison(0.0, BENCHMARK_VOLATILITY * 100),
                new MetricComparison(0.0, BENCHMARK_SHARPE_RATIO),
                new MetricComparison(0.0, BENCHMARK_BETA),
                new MetricComparison(0.0, BENCHMARK_MAX_DRAWDOWN)
        );

        // Empty Value at Risk (0.0 values, 0.0 percentages)
        ValueAtRisk emptyVaR = new ValueAtRisk(
                new VaRMetric(0.0, 0.0),
                new VaRMetric(0.0, 0.0)
        );

        // Default Risk Assessment
        RiskAssessment emptyAssessment = new RiskAssessment("Cash/Uninvested", "Portfolio data currently unavailable or held entirely in cash.");

        // Return a zeroed-out risk analysis
        return new RiskAnalysisDTO(clientId, emptyMetrics, emptyVaR, emptyAssessment, LocalDateTime.now());
    }
}