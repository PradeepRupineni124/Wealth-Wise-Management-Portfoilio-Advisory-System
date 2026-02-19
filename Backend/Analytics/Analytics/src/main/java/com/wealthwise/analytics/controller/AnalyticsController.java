package com.wealthwise.analytics.controller;

import com.wealthwise.analytics.dto.AnalyticsDashboardDTO;
import com.wealthwise.analytics.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard/{clientId}")
    public ResponseEntity<AnalyticsDashboardDTO> getDashboard(@PathVariable String clientId) {
        AnalyticsDashboardDTO dashboard = analyticsService.getDashboard(clientId);
        return ResponseEntity.ok(dashboard);
    }
}
