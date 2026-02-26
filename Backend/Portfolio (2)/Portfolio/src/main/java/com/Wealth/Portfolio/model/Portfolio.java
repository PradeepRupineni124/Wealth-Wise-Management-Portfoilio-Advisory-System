package com.Wealth.Portfolio.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "PORTFOLIO")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Portfolio_Id")
    private Long portfolioId;

    @Column(name = "Client_Id", nullable = false)
    private Long clientId;

    @Column(name = "Cash_Balance", nullable = false, precision = 15, scale = 2)
    private BigDecimal cashBalance;


    // CHANGE THIS FROM Integer riskScore to String riskProfile
    @Column(name = "Risk_Profile", length = 50)
    private String riskProfile;

}