package com.wealth.advisory.dto;

import lombok.Data;

@Data
public class AiRecommendationResponse {
    private String title;
    private String priority;
    private String strategyType;
    private String action;
    private String potentialImpact;
    private String rationale;
}