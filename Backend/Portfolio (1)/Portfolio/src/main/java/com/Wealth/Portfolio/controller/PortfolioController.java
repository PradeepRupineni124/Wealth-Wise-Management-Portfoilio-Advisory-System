package com.Wealth.Portfolio.controller;

import com.Wealth.Portfolio.dto.HoldingRequest;
import com.Wealth.Portfolio.dto.PortfolioRequest;
import com.Wealth.Portfolio.dto.PortfolioResponse;
import com.Wealth.Portfolio.model.Holding;
import com.Wealth.Portfolio.service.PortfolioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PortfolioController {

    private final PortfolioService portfolioService;

    @PostMapping
    public ResponseEntity<PortfolioResponse> createPortfolio(@Valid @RequestBody PortfolioRequest request) {
        PortfolioResponse response = portfolioService.createPortfolio(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PortfolioResponse>> getUserPortfolios(@PathVariable Integer userId) {
        List<PortfolioResponse> portfolios = portfolioService.getUserPortfolios(userId);
        return ResponseEntity.ok(portfolios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PortfolioResponse> getPortfolioById(@PathVariable Integer id) {
        PortfolioResponse response = portfolioService.getPortfolioById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PortfolioResponse> updatePortfolio(
            @PathVariable Integer id,
            @Valid @RequestBody PortfolioRequest request) {
        PortfolioResponse response = portfolioService.updatePortfolio(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePortfolio(@PathVariable Integer id) {
        portfolioService.deletePortfolio(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/holdings")
    public ResponseEntity<PortfolioResponse> addHolding(@Valid @RequestBody HoldingRequest request) {
        PortfolioResponse response = portfolioService.addHolding(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/holdings/{holdingId}")
    public ResponseEntity<PortfolioResponse> updateHolding(
            @PathVariable Integer holdingId, // Changed to Integer
            @Valid @RequestBody HoldingRequest request) {
        PortfolioResponse response = portfolioService.updateHolding(holdingId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/holdings/{holdingId}")
    public ResponseEntity<Void> deleteHolding(@PathVariable Integer holdingId) { // Changed to Integer
        portfolioService.deleteHolding(holdingId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{portfolioId}/holdings")
    public ResponseEntity<List<Holding>> getPortfolioHoldings(@PathVariable Integer portfolioId) { // Changed to Integer
        List<Holding> holdings = portfolioService.getPortfolioHoldings(portfolioId);
        return ResponseEntity.ok(holdings);
    }
}