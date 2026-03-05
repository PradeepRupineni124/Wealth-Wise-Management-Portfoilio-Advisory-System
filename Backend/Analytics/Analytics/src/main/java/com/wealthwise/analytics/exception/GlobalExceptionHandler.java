package com.wealthwise.analytics.exception;

import feign.FeignException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(PortfolioDataUnavailableException.class)
    public ResponseEntity<ErrorResponse> handlePortfolioDataUnavailable(
            PortfolioDataUnavailableException ex,
            HttpServletRequest request) {
        log.error("Portfolio data unavailable: {}", ex.getMessage(), ex);
        ErrorResponse response = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.SERVICE_UNAVAILABLE.value(),
                "SERVICE_UNAVAILABLE",
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
    }

    @ExceptionHandler(MetricsCalculationException.class)
    public ResponseEntity<ErrorResponse> handleMetricsCalculation(
            MetricsCalculationException ex,
            HttpServletRequest request) {
        log.warn("Metrics calculation failed: {}", ex.getMessage());
        ErrorResponse response = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.UNPROCESSABLE_ENTITY.value(),
                "UNPROCESSABLE_ENTITY",
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(response);
    }

    @ExceptionHandler(FeignException.class)
    public ResponseEntity<ErrorResponse> handleFeignException(
            FeignException ex,
            HttpServletRequest request) {
        log.error("Feign client error: {} - {}", ex.status(), ex.getMessage(), ex);
        int status = ex.status() != -1 ? ex.status() : HttpStatus.INTERNAL_SERVER_ERROR.value();
        ErrorResponse response = new ErrorResponse(
                LocalDateTime.now(),
                status,
                "EXTERNAL_SERVICE_ERROR",
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(status).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception ex,
            HttpServletRequest request) {
        log.error("Unexpected error occurred during analytics processing", ex);
        ErrorResponse response = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "INTERNAL_SERVER_ERROR",
                "An unexpected error occurred during analytics processing",
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}

