package com.Wealth.Portfolio.repository;

// Add this specific import
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.Wealth.Portfolio.model.Portfolio;
import org.springframework.lang.NonNull;

@Repository
public interface PortfolioRepository extends JpaRepository< Portfolio,  Integer> {
    List<Portfolio> findByClientId(Integer clientId);
}