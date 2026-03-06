package com.wealthwise.compliance.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing a holding returned by the portfolio service.
 * Includes mapped fields to handle the JSON structure from the Portfolio microservice.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioHoldingDTO {

    // Maps the Portfolio Service's "name" JSON field to "assetName"
    @JsonProperty("name")
    private String assetName;

    // Maps the Portfolio Service's "marketValue" JSON field to "assetValue"
    @JsonProperty("marketValue")
    private double assetValue;

    // Maps the Portfolio Service's "geography" JSON field to "sectorName"
    @JsonProperty("geography")
    private String sectorName;

    // Maps the Portfolio Service's "type" JSON field to "assetType"
    @JsonProperty("type")
    private String assetType;

    // --- FALLBACK VALUES ---
    // The Portfolio Service currently does not send these properties. 
    // We set safe defaults here to prevent Compliance Calculation Exceptions (500 errors).

    @Builder.Default
    private boolean isLiquid = true;

    @Builder.Default
    private boolean isDebt = false;

    @Builder.Default
    private double riskScore = 5.0; // Moderate default risk score
}