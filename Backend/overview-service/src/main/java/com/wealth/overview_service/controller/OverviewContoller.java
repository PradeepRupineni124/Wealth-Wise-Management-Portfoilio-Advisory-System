package com.wealth.overview_service.controller;

import com.wealth.overview_service.dto.ChartDataDto;
import com.wealth.overview_service.dto.OverviewDto;
import com.wealth.overview_service.service.OverviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("overview")
public class OverviewContoller {

    private final OverviewService overviewService;

    @GetMapping("client/{clientId}")
    public ResponseEntity<OverviewDto> getDashboardOverview(@PathVariable Long clientId) {
        return ResponseEntity.ok(overviewService.getClientDashboard(clientId));
    }

//    @GetMapping("/chart/{clientId}")
//    public ResponseEntity<ChartDataDto> getPortfolioChart(
//            @PathVariable Long clientId,
//            @RequestParam(defaultValue = "6M") String range) {
//        return ResponseEntity.ok(overviewService.getChartData(clientId, range));
//    }
}
