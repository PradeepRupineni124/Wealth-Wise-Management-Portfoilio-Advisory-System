package com.wealthwise.compliance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Standard error response DTO for exception handling
 * Provides consistent error response structure across the API
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorResponse {

    /**
     * Timestamp when the error occurred
     */
    private LocalDateTime timestamp;

    /**
     * HTTP status code (e.g., 404, 400, 500)
     */
    private int status;

    /**
     * HTTP status error description (e.g., "Not Found", "Bad Request")
     */
    private String error;

    /**
     * Detailed error message
     */
    private String message;

    /**
     * Request path that caused the error
     */
    private String path;
}
