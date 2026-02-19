package com.Wealth.Portfolio.repository;

import com.Wealth.Portfolio.model.Holding; // Add this specific import
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PortfolioHoldingRepository extends JpaRepository<Holding, Integer> {
    List<Holding> findByPortfolio_PortfolioId(Integer portfolioId);
}