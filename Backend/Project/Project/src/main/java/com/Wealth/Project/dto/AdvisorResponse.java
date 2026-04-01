package com.Wealth.Project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdvisorResponse {
    private Long advisorId;
    private String fullName;
    private String email;
}