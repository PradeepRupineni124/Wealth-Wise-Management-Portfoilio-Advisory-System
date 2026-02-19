package com.Wealth.Portfolio.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class HoldingRequest {
    private Integer portfolioId;
    private Integer assetId;
    private BigDecimal quantity;
    private BigDecimal buyPrice;
    private LocalDate purchaseDate;
    // Note: assetType is now stored in the Asset entity, not the request.
}