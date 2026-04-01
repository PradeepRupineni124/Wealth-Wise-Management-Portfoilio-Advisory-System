package com.Wealth.Portfolio.dto;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class AddInvestmentRequestDTO {
    private String type;          // e.g., "Equity"
    private String symbol;        // e.g., "AAPL"
    private BigDecimal qty;       // e.g., 100
    private BigDecimal purchasePrice; // Maps to Buy_Price
    private BigDecimal allocation;    // Maps to Target_Alloc_%
}