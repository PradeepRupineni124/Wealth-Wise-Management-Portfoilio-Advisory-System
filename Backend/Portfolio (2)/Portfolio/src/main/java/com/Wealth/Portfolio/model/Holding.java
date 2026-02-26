package com.Wealth.Portfolio.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "HOLDING")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Holding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Holding_Id")
    private Long holdingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Portfolio_Id", nullable = false)
    private Portfolio portfolio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Asset_Id", nullable = false)
    private Asset asset;

    @Column(name = "Quantity", nullable = false, precision = 18, scale = 6)
    private BigDecimal quantity;

    @Column(name = "Buy_Price", nullable = false, precision = 15, scale = 2)
    private BigDecimal buyPrice;

    // Add this missing field back:
    @Column(name = "Target_Alloc_Pct", precision = 5, scale = 2)
    private BigDecimal targetAllocPct;

    @Column(name = "Added_Date")
    private LocalDateTime addedDate;
}