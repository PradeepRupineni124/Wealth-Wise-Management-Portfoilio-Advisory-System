package com.Wealth.Portfolio.repository;


import com.Wealth.Portfolio.model.Holding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HoldingRepository extends JpaRepository<Holding, Long> {
    List<Holding> findByPortfolioPortfolioId(Long portfolioId);
}