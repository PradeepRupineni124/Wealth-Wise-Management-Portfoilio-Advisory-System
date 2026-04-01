package com.wealth.overview_service.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class HoldingDTO {
    private Long holdingId;
    private String symbol;
    private String name;
    private BigDecimal qty;
    private BigDecimal avgPrice;
    private LocalDateTime addedDate;
}