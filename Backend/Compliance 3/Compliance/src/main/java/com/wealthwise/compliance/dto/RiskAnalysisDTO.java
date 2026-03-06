package com.wealthwise.compliance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Risk Analysis Metrics
 * Drives the progress bars and risk indicators in the UI
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskAnalysisDTO {

    /**
     * Single Asset Exposure Risk (0-100%)
     * Formula: (Largest Asset Value / Total Portfolio Value) * 100
     */
    private double singleAssetExposure;

    /**
     * Sector Concentration Risk (0-100%)
     * Formula: (Largest Sector Value / Total Portfolio Value) * 100
     */
    private double sectorConcentration;

    /**
     * Leverage Ratio
     * Formula: Total Debt / Total Equity
     */
    private double leverageRatio;

    /**
     * Liquidity Coverage Ratio (0-100%)
     * Formula: (Liquid Assets / Total Assets) * 100
     */
    private double liquidityCoverage;
}
