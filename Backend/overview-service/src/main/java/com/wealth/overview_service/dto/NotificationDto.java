package com.wealth.overview_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationDto {
    private String id;
    private String title;
    private String message;
    private String time;
    private String type;
}
