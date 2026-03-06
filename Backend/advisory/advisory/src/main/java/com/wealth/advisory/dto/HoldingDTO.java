package com.wealth.advisory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HoldingDTO {
    private String symbol;
    private String type;
    private BigDecimal qty;
    private BigDecimal marketValue;
}