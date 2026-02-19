package com.Wealth.Portfolio.repository;

import com.Wealth.Portfolio.model.Asset; // Add this specific import
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Integer> {}