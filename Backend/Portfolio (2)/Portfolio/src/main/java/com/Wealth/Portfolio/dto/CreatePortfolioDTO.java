package com.Wealth.Portfolio.dto;

import lombok.Data;

@Data
public class CreatePortfolioDTO {
    // The ONLY thing the frontend needs to send now!
    private Long clientId;
}