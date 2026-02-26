package com.wealth.overview_service.dto;

import lombok.Data;

@Data
public class ClientDTO {
    private Long clientId;
    private String fullName;
    private String emailAddress;
    private String phoneNumber;
    private Long advisorId;
}
