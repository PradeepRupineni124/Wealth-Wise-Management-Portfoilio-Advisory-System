package com.wealthwise.compliance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing client profile data
 * Used for compliance checks against client characteristics
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientDataDTO {
    
    /**
     * Client's KYC (Know Your Customer) verification status
     * Values: "Verified", "Pending", "Rejected", null
     */
    private String kycStatus;
    
    /**
     * Client's declared risk profile score (0-10)
     * 0 = Conservative, 5 = Moderate, 10 = Aggressive
     */
    private String riskProfile;
    
    /**
     * Client's stated financial goals
     * Examples: "Retirement Planning", "Child Education", "Wealth Growth"
     */
    private String investmentGoal;;
    
    /**
     * Client's annual income (for suitability checks)
     */
    private double annualIncome;
    
    /**
     * Client's investment experience level
     * Values: "Beginner", "Intermediate", "Advanced"
     */
    private String experienceLevel;
}
