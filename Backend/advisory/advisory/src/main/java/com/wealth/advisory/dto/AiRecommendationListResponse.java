package com.wealth.advisory.dto;

import lombok.Data;
import java.util.List;

@Data
public class AiRecommendationListResponse {
    private List<AiRecommendationResponse> recommendations;
}