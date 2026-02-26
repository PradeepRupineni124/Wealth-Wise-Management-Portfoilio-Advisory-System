package com.Wealth.Portfolio.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ClientDTO {
    private Long clientId;
    private String fullName;
    private String emailAddress;
    private BigDecimal investmentAmount; // We need this for the portfolio cash balance!
    private String riskProfile;          // e.g., "AGGRESSIVE", "MODERATE"
}