package com.Wealth.Portfolio.service;

import com.Wealth.Portfolio.client.ClientServiceClient;
import com.Wealth.Portfolio.dto.*;
import com.Wealth.Portfolio.exception.ResourceNotFoundException;
import com.Wealth.Portfolio.model.Asset;
import com.Wealth.Portfolio.model.Holding;
import com.Wealth.Portfolio.model.Portfolio;
import com.Wealth.Portfolio.repository.AssetRepository;
import com.Wealth.Portfolio.repository.HoldingRepository;
import com.Wealth.Portfolio.repository.PortfolioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;
import com.Wealth.Portfolio.exception.BadRequestException;

@Service
@Slf4j
@RequiredArgsConstructor
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final HoldingRepository holdingRepository;
    private final AssetRepository assetRepository;
    private final ClientServiceClient clientServiceClient;

    // 1. Create Portfolio with Risk Profile Mapping
    // Make sure to inject your Feign Client at the top of PortfolioService!
    // private final ClientServiceClient clientServiceClient;

    public Portfolio createPortfolio(Long clientId) {
        log.info("Creating new portfolio for Client ID: {}", clientId);

        // 1. Call the Client Service through the Feign bridge!
        ClientDTO clientData = clientServiceClient.getClientById(clientId);

        // 2. Build the Portfolio using the secure data from the Client Service
        Portfolio newPortfolio = Portfolio.builder()
                .clientId(clientId)
                .cashBalance(clientData.getInvestmentAmount()) // Fetched securely!
                .riskProfile(clientData.getRiskProfile())      // Fetched securely!
                .build();

        // 3. Save to the database
        return portfolioRepository.save(newPortfolio);
    }

    // 2. Fetch the summary cards (ALL 7 CARDS)
    public PortfolioSummaryDTO getPortfolioSummary(Long clientId) {
        log.info("Fetching portfolio summary for Client ID: {}", clientId);

        Portfolio portfolio = portfolioRepository.findByClientId(clientId).stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found for Client ID: " + clientId));

        List<Holding> holdings = holdingRepository.findByPortfolioPortfolioId(portfolio.getPortfolioId());

        BigDecimal totalMarketValue = BigDecimal.ZERO;
        BigDecimal totalBuyValue = BigDecimal.ZERO;

        // Buckets for the Asset Class cards
        BigDecimal eqValue = BigDecimal.ZERO;
        BigDecimal bondValue = BigDecimal.ZERO;
        BigDecimal mfValue = BigDecimal.ZERO;

        // --- 1. NEW: Variables for Annual (YTD) Return ---
        int currentYear = java.time.LocalDateTime.now().getYear();
        BigDecimal ytdBuyValue = BigDecimal.ZERO;
        BigDecimal ytdMarketValue = BigDecimal.ZERO;

        for (Holding holding : holdings) {
            BigDecimal marketValue = holding.getQuantity().multiply(holding.getAsset().getCurrentPrice());
            BigDecimal buyValue = holding.getQuantity().multiply(holding.getBuyPrice());

            totalMarketValue = totalMarketValue.add(marketValue);
            totalBuyValue = totalBuyValue.add(buyValue);

            // --- 2. NEW: Calculate values ONLY for assets bought this year ---
            if (holding.getAddedDate() != null && holding.getAddedDate().getYear() == currentYear) {
                ytdMarketValue = ytdMarketValue.add(marketValue);
                ytdBuyValue = ytdBuyValue.add(buyValue);
            }

            // Group by Asset Type for the bottom cards
            String type = holding.getAsset().getAssetType();
            if ("Equity".equalsIgnoreCase(type)) {
                eqValue = eqValue.add(marketValue);
            } else if ("Bond".equalsIgnoreCase(type)) {
                bondValue = bondValue.add(marketValue);
            } else {
                mfValue = mfValue.add(marketValue);
            }
        }

        BigDecimal totalPortfolioValue = totalMarketValue.add(portfolio.getCashBalance());

        // Calculate Total Return %
        BigDecimal totalReturnPct = BigDecimal.ZERO;
        if (totalBuyValue.compareTo(BigDecimal.ZERO) > 0) {
            totalReturnPct = totalMarketValue.subtract(totalBuyValue)
                    .divide(totalBuyValue, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"));
        }

        // --- 3. NEW: Apply the Annual Return Math Formula ---
        BigDecimal annualReturnPct = BigDecimal.ZERO;
        if (ytdBuyValue.compareTo(BigDecimal.ZERO) > 0) {
            annualReturnPct = ytdMarketValue.subtract(ytdBuyValue)
                    .divide(ytdBuyValue, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"));
        }

        // Calculate Allocations for the Badges
        String eqBadge = totalPortfolioValue.compareTo(BigDecimal.ZERO) > 0 ? eqValue.divide(totalPortfolioValue, 2, RoundingMode.HALF_UP).multiply(new BigDecimal("100")).intValue() + "%" : "0%";
        String bondBadge = totalPortfolioValue.compareTo(BigDecimal.ZERO) > 0 ? bondValue.divide(totalPortfolioValue, 2, RoundingMode.HALF_UP).multiply(new BigDecimal("100")).intValue() + "%" : "0%";
        String mfBadge = totalPortfolioValue.compareTo(BigDecimal.ZERO) > 0 ? mfValue.divide(totalPortfolioValue, 2, RoundingMode.HALF_UP).multiply(new BigDecimal("100")).intValue() + "%" : "0%";

        // Formatter for clean numbers with commas (e.g., $1,146,551)
        java.text.NumberFormat fmt = java.text.NumberFormat.getNumberInstance(java.util.Locale.US);
        fmt.setMaximumFractionDigits(0);

        // 1. TOP 4 STAT CARDS
        // 1. TOP 5 STAT CARDS
        List<StatCardDTO> stats = List.of(
                StatCardDTO.builder().title("Total Portfolio Value").value("$" + fmt.format(totalPortfolioValue)).color("#0f172a").build(),
                StatCardDTO.builder().title("Available Cash").value("$" + fmt.format(portfolio.getCashBalance())).color("#0f172a").build(), // The new Cash card!
                StatCardDTO.builder().title("Total Return").value(annualReturnPct.setScale(2, RoundingMode.HALF_UP) + "%").color(annualReturnPct.compareTo(BigDecimal.ZERO) >= 0 ? "#10b981" : "#ef4444").build(),
                StatCardDTO.builder().title("Total Positions").value(String.valueOf(holdings.size())).color("#0f172a").build(),
                StatCardDTO.builder().title("Asset Classes").value("3").color("#0f172a").build() // Kept the Asset Classes card!
        );

        // 2. BOTTOM 3 ASSET CLASS CARDS
        List<AssetClassDTO> assetClasses = List.of(
                AssetClassDTO.builder().title("Equities").value("$" + fmt.format(eqValue)).badgeText(eqBadge).badgeBgColor("#eefdf3").trendText("+15.2% YTD").trendColor("#10b981").build(),
                AssetClassDTO.builder().title("Bonds").value("$" + fmt.format(bondValue)).badgeText(bondBadge).badgeBgColor("#eff6ff").trendText("+1.4% YTD").trendColor("#3b82f6").build(),
                AssetClassDTO.builder().title("Mutual Funds").value("$" + fmt.format(mfValue)).badgeText(mfBadge).badgeBgColor("#fef3c7").trendText("+8.5% YTD").trendColor("#f59e0b").build()
        );

        return PortfolioSummaryDTO.builder()
                .portfolioId(portfolio.getPortfolioId())
                .cashBalance(portfolio.getCashBalance())
                .stats(stats)
                .assetClasses(assetClasses) // Sending the bottom cards to Angular!
                .build();
    }

    // 3. Fetch JUST the Holdings for the AG Grid
    public List<HoldingDTO> getPortfolioHoldings(Long portfolioId) {
        log.info("Fetching holdings for Portfolio ID: {}", portfolioId);

        // We need the portfolio to get the cash balance!
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));

        List<Holding> holdings = holdingRepository.findByPortfolioPortfolioId(portfolioId);

        // --- STEP A: CALCULATE TOTAL PORTFOLIO VALUE ---
        BigDecimal totalInvested = holdings.stream()
                .map(h -> h.getQuantity().multiply(h.getAsset().getCurrentPrice()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalPortfolioValue = totalInvested.add(portfolio.getCashBalance());

        // --- STEP B: MAP TO DTO AND CALCULATE PERCENTAGES ---
        return holdings.stream().map(holding -> {
            BigDecimal qty = holding.getQuantity();
            BigDecimal currentPrice = holding.getAsset().getCurrentPrice();
            BigDecimal avgPrice = holding.getBuyPrice();
            BigDecimal marketValue = qty.multiply(currentPrice);

            // Calculate Return %
            BigDecimal returnPct = BigDecimal.ZERO;
            if (avgPrice.compareTo(BigDecimal.ZERO) > 0) {
                returnPct = currentPrice.subtract(avgPrice)
                        .divide(avgPrice, 4, RoundingMode.HALF_UP)
                        .multiply(new BigDecimal("100"));
            }

            // Calculate Allocation %
            BigDecimal allocationPct = BigDecimal.ZERO;
            if (totalPortfolioValue.compareTo(BigDecimal.ZERO) > 0) {
                allocationPct = marketValue
                        .divide(totalPortfolioValue, 4, RoundingMode.HALF_UP)
                        .multiply(new BigDecimal("100"));
            }

            return HoldingDTO.builder()
                    .holdingId(holding.getHoldingId())
                    .symbol(holding.getAsset().getSymbol())
                    .name(holding.getAsset().getAssetName())
                    .type(holding.getAsset().getAssetType())
                    .qty(qty)
                    .avgPrice(avgPrice)
                    .currentPrice(currentPrice)
                    .marketValue(marketValue)
                    .returnPct(returnPct)
                    .allocationPct(allocationPct) // <--- SENDING THE NEW CALCULATION!
                    .geography(holding.getAsset().getGeography())
                    .addedDate(holding.getAddedDate())
                    .build();
        }).collect(Collectors.toList());
    }
    // 4. Add a new investment (Holding) to a portfolio
    // 4. Add a new investment OR update an existing one
    @Transactional // Rolls back the database if anything fails!
    public void addInvestmentToPortfolio(Long portfolioId, AddInvestmentRequestDTO request) {
        log.info("Processing investment {} for Portfolio ID: {}", request.getSymbol(), portfolioId);

        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found with ID: " + portfolioId));

        Asset asset = assetRepository.findBySymbol(request.getSymbol())
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found in master list: " + request.getSymbol()));

        // --- 1. CALCULATE TOTAL COST ---
        BigDecimal newQty = request.getQty();
        BigDecimal newPrice = request.getPurchasePrice();
        BigDecimal totalCost = newQty.multiply(newPrice);

        // --- 2. CHECK FOR INSUFFICIENT FUNDS ---
        if (portfolio.getCashBalance().compareTo(totalCost) < 0) {
            log.warn("Insufficient funds! Cash: {}, Required: {}", portfolio.getCashBalance(), totalCost);
            throw new BadRequestException("Insufficient cash balance. You need $" + totalCost + " but only have $" + portfolio.getCashBalance());
        }

        // --- 3. DEDUCT THE CASH ---
        portfolio.setCashBalance(portfolio.getCashBalance().subtract(totalCost));
        portfolioRepository.save(portfolio);

        // --- 4. CHECK IF ASSET ALREADY EXISTS IN PORTFOLIO ---
        List<Holding> existingHoldings = holdingRepository.findByPortfolioPortfolioId(portfolioId);

        Holding existingHolding = existingHoldings.stream()
                .filter(h -> h.getAsset().getSymbol().equalsIgnoreCase(request.getSymbol()))
                .findFirst()
                .orElse(null);

        if (existingHolding != null) {
            // SCENARIO A: THE USER ALREADY OWNS THIS ASSET
            log.info("Asset {} already exists. Updating quantity and calculating new Average Price.", request.getSymbol());

            BigDecimal oldQty = existingHolding.getQuantity();
            BigDecimal oldAvgPrice = existingHolding.getBuyPrice();

            // Math for new Average Buy Price: ((Old Qty * Old Price) + (New Qty * New Price)) / Total Qty
            BigDecimal totalOldCost = oldQty.multiply(oldAvgPrice);
            BigDecimal combinedQty = oldQty.add(newQty);
            BigDecimal newAvgPrice = (totalOldCost.add(totalCost)).divide(combinedQty, 4, RoundingMode.HALF_UP);

            // Update the existing row
            existingHolding.setQuantity(combinedQty);
            existingHolding.setBuyPrice(newAvgPrice);
            existingHolding.setTargetAllocPct(request.getAllocation()); // Update their target goal

            holdingRepository.save(existingHolding);
            log.info("Successfully updated {}. New Qty: {}, New Avg Price: {}", request.getSymbol(), combinedQty, newAvgPrice);

        } else {
            // SCENARIO B: THIS IS A BRAND NEW ASSET
            log.info("Asset {} is new. Creating a new holding row.", request.getSymbol());

            Holding newHolding = Holding.builder()
                    .portfolio(portfolio)
                    .asset(asset)
                    .quantity(newQty)
                    .buyPrice(newPrice)
                    .targetAllocPct(request.getAllocation())
                    .addedDate(java.time.LocalDateTime.now())
                    .build();

            holdingRepository.save(newHolding);
            log.info("Successfully saved new holding for {}.", request.getSymbol());
        }
    }
    // 5. Update an existing holding (e.g., editing quantity in AG Grid)
    public Holding updateHolding(Long holdingId, UpdateHoldingDTO dto) {
        log.info("Updating Holding ID: {}", holdingId);

        Holding holding = holdingRepository.findById(holdingId)
                .orElseThrow(() -> new ResourceNotFoundException("Holding not found with ID: " + holdingId));

        holding.setQuantity(dto.getQuantity());
        holding.setBuyPrice(dto.getBuyPrice());
        holding.setTargetAllocPct(dto.getTargetAllocPct());

        return holdingRepository.save(holding);
    }
}