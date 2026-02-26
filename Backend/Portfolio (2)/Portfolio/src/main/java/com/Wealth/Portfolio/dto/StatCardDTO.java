package com.Wealth.Portfolio.dto;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StatCardDTO {
    private String title;
    private String value;
    private String color;
}