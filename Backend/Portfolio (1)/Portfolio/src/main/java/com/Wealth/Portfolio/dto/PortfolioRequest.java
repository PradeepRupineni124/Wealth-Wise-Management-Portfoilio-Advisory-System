package com.Wealth.Portfolio.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class PortfolioRequest {
    @NotNull(message = "Client ID is required")
    private Integer clientId; // Changed from Long userId to Integer clientId

    private BigDecimal cashBalance; // Matches ER Diagram

    @Min(1) @Max(100)
    private Integer riskScore; // Changed from RiskLevel Enum to Integer
}