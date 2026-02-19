package com.wealthwise.analytics.service;

import com.wealthwise.analytics.client.PortfolioFeignClient;
import com.wealthwise.analytics.dto.*;
import com.wealthwise.analytics.util.FinancialCalculator;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
public class AnalyticsService {

    private final PortfolioFeignClient portfolioClient;
    private final FinancialCalculator financialCalculator;

    private static final Double RISK_FREE_RATE = 0.04;
    private static final Double MARKET_RETURN = 0.10;
    private static final Double MARKET_VARIANCE = 0.05;

    public AnalyticsService(PortfolioFeignClient portfolioClient, FinancialCalculator financialCalculator) {
        this.portfolioClient = portfolioClient;
        this.financialCalculator = financialCalculator;
    }

    public AnalyticsDashboardDTO getDashboard(String clientId) {
        PortfolioFeignClient.PortfolioResponse portfolio = portfolioClient.getPortfolioByClientId(clientId);

        Double totalReturnYTD = financialCalculator.calculateTotalReturnYTD(
            portfolio.currentValue(), 
            portfolio.beginningValue()
        );

        Double standardDeviation = financialCalculator.calculateStandardDeviation(portfolio.monthlyReturns());
        Double avgMonthlyReturn = Arrays.stream(portfolio.monthlyReturns()).mapToDouble(Double::doubleValue).average().orElse(0.0) * 12;

        Double sharpeRatio = financialCalculator.calculateSharpeRatio(
            avgMonthlyReturn, 
            RISK_FREE_RATE, 
            standardDeviation
        );

        Double beta = financialCalculator.calculateBeta(0.08, MARKET_VARIANCE);
        Double alpha = financialCalculator.calculateAlpha(
            avgMonthlyReturn, 
            RISK_FREE_RATE, 
            beta, 
            MARKET_RETURN
        );

        PerformanceData performanceData = new PerformanceData(
            totalReturnYTD,
            sharpeRatio,
            beta,
            alpha,
            standardDeviation
        );

        List<Sector> sectors = Arrays.asList(
            new Sector("Technology", 35.5, portfolio.currentValue() * 0.355),
            new Sector("Healthcare", 25.0, portfolio.currentValue() * 0.25),
            new Sector("Financials", 20.0, portfolio.currentValue() * 0.20),
            new Sector("Other", 19.5, portfolio.currentValue() * 0.195)
        );

        List<KeyMetric> keyMetrics = Arrays.asList(
            new KeyMetric("Total Return", totalReturnYTD, "%", 2.5, "UP"),
            new KeyMetric("Sharpe Ratio", sharpeRatio, "", 0.5, "UP"),
            new KeyMetric("Beta", beta, "", -0.05, "DOWN"),
            new KeyMetric("Alpha", alpha, "%", 1.2, "UP")
        );

        return new AnalyticsDashboardDTO(
            clientId,
            portfolio.currentValue(),
            performanceData,
            sectors,
            keyMetrics,
            LocalDateTime.now()
        );
    }
}
