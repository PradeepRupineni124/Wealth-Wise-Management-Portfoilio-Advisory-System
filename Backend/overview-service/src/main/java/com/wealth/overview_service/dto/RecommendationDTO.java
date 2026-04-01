package com.wealth.overview_service.dto;

import lombok.Data;

@Data
public class RecommendationDTO {
    private Long recommendationID;
    private Long portfolioID;

    // This will catch the entire escaped JSON string!
    private String suggestedAction;

    private String date;
    private String status;
}