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
}
