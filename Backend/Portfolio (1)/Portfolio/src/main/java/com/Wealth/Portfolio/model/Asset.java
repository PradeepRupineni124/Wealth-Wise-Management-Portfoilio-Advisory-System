package com.Wealth.Portfolio.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "ASSET")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer assetId;

    @Column(nullable = false, length = 20)
    private String symbol; // e.g., AAPL

    @Column(nullable = false)
    private String assetName; // e.g., Apple Inc.

    @Column(nullable = false)
    private String assetType; // e.g., Equity, Bond, Mutual Fund

    private String sector; // e.g., Technology

    @Column(precision = 15, scale = 2)
    private BigDecimal currentPrice;
}