package com.wealth.overview_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssetAllocationDTO {
    private String label;
    private Double value;
    private Double percentage;
}
