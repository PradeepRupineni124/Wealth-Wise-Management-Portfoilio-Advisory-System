package com.Wealth.Portfolio.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class UpdateHoldingDTO {
    private BigDecimal quantity;
    private BigDecimal buyPrice;
    private BigDecimal targetAllocPct;
}