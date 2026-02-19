package com.Wealth.Portfolio.service;

import com.Wealth.Portfolio.dto.*;
import com.Wealth.Portfolio.exception.*;
import com.Wealth.Portfolio.model.*;
import com.Wealth.Portfolio.repository.*;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final PortfolioHoldingRepository holdingRepository;
    private final AssetRepository assetRepository;

    // --- Portfolio Methods ---

    @Transactional
    public PortfolioResponse createPortfolio(PortfolioRequest request) {
        Portfolio portfolio = new Portfolio();
        portfolio.setClientId(request.getClientId());
        portfolio.setCashBalance(request.getCashBalance());
        portfolio.setRiskScore(request.getRiskScore());

        Portfolio saved = portfolioRepository.save(portfolio);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<PortfolioResponse> getUserPortfolios(Integer clientId) {
        return portfolioRepository.findByClientId(clientId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PortfolioResponse getPortfolioById(Integer id) {
        Portfolio portfolio = portfolioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found with id: " + id));
        return mapToResponse(portfolio);
    }

    @Transactional
    public PortfolioResponse updatePortfolio(Integer id, PortfolioRequest request) {
        Portfolio portfolio = portfolioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));

        portfolio.setCashBalance(request.getCashBalance());
        portfolio.setRiskScore(request.getRiskScore());

        return mapToResponse(portfolioRepository.save(portfolio));
    }

    @Transactional
    public void deletePortfolio(Integer id) {
        if (!portfolioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Portfolio not found");
        }
        portfolioRepository.deleteById(id);
    }

    // --- Holding Methods ---

    @Transactional
    public PortfolioResponse addHolding(HoldingRequest request) {
        Portfolio portfolio = portfolioRepository.findById(request.getPortfolioId())
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));

        Asset asset = assetRepository.findById(request.getAssetId())
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found"));

        Holding holding = new Holding();
        holding.setPortfolio(portfolio);
        holding.setAsset(asset);
        holding.setQuantity(request.getQuantity());
        holding.setBuyPrice(request.getBuyPrice());
        holding.setTargetAllocationPct(BigDecimal.ZERO);

        holdingRepository.save(holding);
        updatePortfolioMetrics(portfolio);

        return mapToResponse(portfolio);
    }

    @Transactional
    public PortfolioResponse updateHolding(Integer holdingId, HoldingRequest request) {
        Holding holding = holdingRepository.findById(holdingId)
                .orElseThrow(() -> new ResourceNotFoundException("Holding not found"));

        holding.setQuantity(request.getQuantity());
        holding.setBuyPrice(request.getBuyPrice());

        holdingRepository.save(holding);
        updatePortfolioMetrics(holding.getPortfolio());
        return mapToResponse(holding.getPortfolio());
    }

    @Transactional
    public void deleteHolding(Integer holdingId) {
        Holding holding = holdingRepository.findById(holdingId)
                .orElseThrow(() -> new ResourceNotFoundException("Holding not found"));

        Portfolio portfolio = holding.getPortfolio();
        holdingRepository.deleteById(holdingId);
        updatePortfolioMetrics(portfolio);
    }

    @Transactional(readOnly = true)
    public List<Holding> getPortfolioHoldings(Integer portfolioId) {
        return holdingRepository.findByPortfolio_PortfolioId(portfolioId);
    }

    // --- Helper Methods ---

    private void updatePortfolioMetrics(Portfolio portfolio) {
        List<Holding> holdings = holdingRepository.findByPortfolio_PortfolioId(portfolio.getPortfolioId());
        BigDecimal totalCurrentValue = BigDecimal.ZERO;

        for (Holding holding : holdings) {
            BigDecimal currentVal = holding.getQuantity().multiply(holding.getAsset().getCurrentPrice());
            totalCurrentValue = totalCurrentValue.add(currentVal);
        }

        portfolio.setCashBalance(totalCurrentValue);
        portfolioRepository.save(portfolio);
    }

    private PortfolioResponse mapToResponse(Portfolio portfolio) {
        PortfolioResponse response = new PortfolioResponse();
        response.setId(portfolio.getPortfolioId());
        response.setClientId(portfolio.getClientId());
        response.setCashBalance(portfolio.getCashBalance());
        response.setRiskScore(portfolio.getRiskScore());
        return response;
    }
}