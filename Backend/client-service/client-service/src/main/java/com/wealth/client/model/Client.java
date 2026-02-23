package com.wealth.client.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "CLIENT")
public class Client {

    // --- IDENTIFICATION ---
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long clientId;

    @Column(nullable = false)
    private Long advisorId;

    // --- PERSONAL DETAILS (From Image 1) ---
    @Column(nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String emailAddress;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private BigDecimal investmentAmount;

    private LocalDate dateOfBirth; // Added for the UI

    @Column(columnDefinition = "TEXT")
    private String address; // Added for the UI

    private String occupation;
    private String employer;

    // --- INVESTMENT PREFERENCES (From Image 2) ---
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RiskProfile riskProfile;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvestmentGoal investmentGoal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvestmentHorizon investmentHorizon;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LiquidityNeeds liquidityNeeds;

    // --- SYSTEM & COMPLIANCE (From Image 3 Header) ---
    @Column(name = "kyc_document_ref")
    private String kycDocumentRef;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private KycStatus kycStatus = KycStatus.NOT_VERIFIED;

    @Column(updatable = false)
    private LocalDateTime createdDate = LocalDateTime.now();
}