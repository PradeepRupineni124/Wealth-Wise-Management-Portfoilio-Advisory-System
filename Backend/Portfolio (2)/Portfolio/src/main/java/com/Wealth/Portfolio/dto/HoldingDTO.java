package com.Wealth.Portfolio.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class HoldingDTO {
    private Long holdingId;
    private String symbol;
    private String name;
    private String type;
    private String sector;
    private BigDecimal qty;
    private BigDecimal avgPrice;
    private BigDecimal currentPrice;
    private BigDecimal marketValue;
    private BigDecimal returnPct;
    private BigDecimal allocationPct;

    // --- NEW FIELD: Add this for the frontend column! ---
    private BigDecimal liquidityAssets;

    private String geography;
    private LocalDateTime addedDate;
}