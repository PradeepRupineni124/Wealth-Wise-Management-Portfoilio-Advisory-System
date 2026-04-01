package com.wealth.overview_service.dto;

import lombok.Data;

@Data
public class RecommendationResponse {
    private String title;
    private String priority;
    private String strategyType;
    private String action;
    private String potentialImpact;
    private String rationale;
}

