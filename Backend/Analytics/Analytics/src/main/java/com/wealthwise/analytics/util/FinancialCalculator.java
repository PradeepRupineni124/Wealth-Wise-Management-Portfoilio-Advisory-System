package com.wealthwise.analytics.util;

import org.springframework.stereotype.Component;

@Component
public class FinancialCalculator {

    /**
     * Calculate Total Return (YTD)
     * Formula: ((Current Value - Beginning Value) / Beginning Value) × 100
     */
    public Double calculateTotalReturnYTD(Double currentValue, Double beginningValue) {
        if (beginningValue == null || beginningValue == 0) {
            return 0.0;
        }
        return ((currentValue - beginningValue) / beginningValue) * 100;
    }

    /**
     * Calculate Sharpe Ratio
     * Formula: (Portfolio Return - Risk Free Rate) / Standard Deviation
     */
    public Double calculateSharpeRatio(Double portfolioReturn, Double riskFreeRate, Double standardDeviation) {
        if (standardDeviation == null || standardDeviation == 0) {
            return 0.0;
        }
        return (portfolioReturn - riskFreeRate) / standardDeviation;
    }

    /**
     * Calculate Beta
     * Formula: Covariance(Portfolio, Market) / Variance(Market)
     */
    public Double calculateBeta(Double covariance, Double marketVariance) {
        if (marketVariance == null || marketVariance == 0) {
            return 1.0;
        }
        return covariance / marketVariance;
    }

    /**
     * Calculate Alpha
     * Formula: Portfolio Return - [Risk Free Rate + Beta × (Market Return - Risk Free Rate)]
     */
    public Double calculateAlpha(Double portfolioReturn, Double riskFreeRate, Double beta, Double marketReturn) {
        Double capm = riskFreeRate + (beta * (marketReturn - riskFreeRate));
        return portfolioReturn - capm;
    }

    /**
     * Calculate Standard Deviation from returns array
     */
    public Double calculateStandardDeviation(Double[] returns) {
        if (returns == null || returns.length == 0) {
            return 0.0;
        }
        
        Double mean = 0.0;
        for (Double ret : returns) {
            mean += ret;
        }
        mean /= returns.length;
        
        Double variance = 0.0;
        for (Double ret : returns) {
            variance += Math.pow(ret - mean, 2);
        }
        variance /= returns.length;
        
        return Math.sqrt(variance);
    }

    /**
     * Calculate Max Drawdown from returns array
     * Formula: (Trough Value - Peak Value) / Peak Value
     */
    public Double calculateMaxDrawdown(Double[] returns) {
        if (returns == null || returns.length == 0) {
            return 0.0;
        }

        Double peak = 1.0;
        Double maxDrawdown = 0.0;

        for (Double ret : returns) {
            Double currentValue = peak * (1 + ret);
            if (currentValue > peak) {
                peak = currentValue;
            }
            Double drawdown = (currentValue - peak) / peak;
            if (drawdown < maxDrawdown) {
                maxDrawdown = drawdown;
            }
        }
        return maxDrawdown * 100; // Return as percentage
    }

    /**
     * Calculate Value at Risk (VaR) using Parametric method (Variance-Covariance)
     * Formula: Portfolio Value × Z-Score × Standard Deviation
     * Z-Score for 95% confidence = 1.645
     */
    public Double calculateVaR95(Double portfolioValue, Double standardDeviation, int daysOrMonths) {
        Double zScore = 1.645; // 95% confidence level
        Double adjustmentFactor = Math.sqrt(daysOrMonths);
        return portfolioValue * zScore * standardDeviation * adjustmentFactor;
    }

    /**
     * Determine overall risk level based on volatility (standard deviation)
     * and other risk metrics
     */
    public String determineRiskLevel(Double volatility, Double maxDrawdown, Double beta) {
        // Conservative: volatility < 10%, beta < 0.8
        if (volatility < 10.0 && beta < 0.8) {
            return "Conservative";
        }
        // Moderate: volatility 10-20%, beta 0.8-1.2
        else if (volatility < 20.0 && beta <= 1.2) {
            return "Moderate";
        }
        // Moderately Aggressive: volatility 20-30%, beta 1.2-1.5
        else if (volatility < 30.0 && beta <= 1.5) {
            return "Moderately Aggressive";
        }
        // Aggressive: volatility >= 30%
        else {
            return "Aggressive";
        }
    }

    /**
     * Get risk description based on risk level
     */
    public String getRiskDescription(String riskLevel) {
        return switch (riskLevel) {
            case "Conservative" -> "Primary focus on capital preservation and income. Suitable for investors with low risk tolerance.";
            case "Moderate" -> "Balanced approach between growth and stability. Suitable for investors with moderate risk tolerance.";
            case "Moderately Aggressive" -> "Emphasis on capital growth with some volatility. Suitable for investors with higher risk tolerance.";
            case "Aggressive" -> "High growth focus with significant volatility. Suitable for investors with very high risk tolerance.";
            default -> "Risk profile not determined.";
        };
    }
}
