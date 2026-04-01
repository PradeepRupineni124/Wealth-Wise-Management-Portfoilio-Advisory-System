package com.Wealth.Portfolio.controller;

import com.Wealth.Portfolio.dto.UpdateHoldingDTO;
import com.Wealth.Portfolio.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/holdings")
@Slf4j
@RequiredArgsConstructor
public class HoldingController {

    private final PortfolioService portfolioService;

    @PutMapping("/{id}")
    public ResponseEntity<String> updateHolding(
            @PathVariable Long id,
            @RequestBody UpdateHoldingDTO request) {

        log.info("REST request to update Holding ID: {}", id);

        // We still perform the update in the database
        portfolioService.updateHolding(id, request);

        // But we return a clean success message instead of the raw database entity!
        return ResponseEntity.ok("Holding updated successfully");
    }
}