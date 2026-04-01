package com.Wealth.Portfolio.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime; // <-- Added this import

@Entity
@Table(name = "ASSET")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Asset_Id")
    private Long assetId;

    @Column(name = "Symbol", nullable = false, unique = true, length = 10)
    private String symbol;

    @Column(name = "Asset_Name", nullable = false, length = 100)
    private String assetName;

    @Column(name = "Asset_Type", nullable = false, length = 50)
    private String assetType;

    // --- NEW COLUMNS FOR EXCEL/CSV UPLOAD ---

    @Column(name = "Sector", length = 50)
    private String sector;

    @Column(name = "Currency", length = 10)
    private String currency;

    @Column(name = "Current_Price", nullable = false, precision = 15, scale = 2)
    private BigDecimal currentPrice;

    @Column(name = "Geography", length = 50)
    private String geography;

    @Column(name = "Last_Updated")
    private java.time.LocalDateTime lastUpdated;
}