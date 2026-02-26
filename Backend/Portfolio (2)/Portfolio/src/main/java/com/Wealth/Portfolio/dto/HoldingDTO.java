package com.Wealth.Portfolio.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime; // <-- Add this import

@Data
@Builder
public class HoldingDTO {
    private Long holdingId;
    private String symbol;
    private String name;
    private String type;
    private BigDecimal qty;
    private BigDecimal avgPrice;
    private BigDecimal currentPrice;
    private BigDecimal marketValue;
    private BigDecimal returnPct;

    // --- ADD THESE TWO FIELDS FOR THE ANALYSIS MODULE ---
    private BigDecimal allocationPct;
    private String geography;
    private LocalDateTime addedDate;
}