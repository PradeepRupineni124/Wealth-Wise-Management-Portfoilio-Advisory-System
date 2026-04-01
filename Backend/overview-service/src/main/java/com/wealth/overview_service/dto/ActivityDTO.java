package com.wealth.overview_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActivityDTO {
    private String id;
    private String title;
    private String symbol;
    private String date;
    private String amount;
    private String status;
    private String type;
}
