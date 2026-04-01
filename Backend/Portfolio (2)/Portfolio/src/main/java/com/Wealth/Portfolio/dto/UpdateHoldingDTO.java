package com.Wealth.Portfolio.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class UpdateHoldingDTO {
    // This is the only field Angular is sending during an inline grid edit
    private BigDecimal quantity;

    // These are optional in case you use them elsewhere
    private BigDecimal buyPrice;
    private BigDecimal targetAllocPct;
}