package com.wealth.advisory.exception;

import com.wealth.advisory.dto.ErrorDetails;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.util.Date;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * Handles Gemini API Quota (429) errors.
     * Logged as WARN because it's an external limit, not a code crash.
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorDetails> handleAiQuotaException(RuntimeException ex, WebRequest request) {
        String requestInfo = request.getDescription(false);

        if (ex.getMessage() != null && ex.getMessage().contains("quota")) {
            log.warn("AI QUOTA EXCEEDED | Request: {} | Error: {}", requestInfo, ex.getMessage());

            ErrorDetails errorDetails = new ErrorDetails(
                    new Date(),
                    "Gemini AI limit reached (Free Tier). Please wait 60 seconds.",
                    requestInfo
            );
            return new ResponseEntity<>(errorDetails, HttpStatus.TOO_MANY_REQUESTS);
        }

        // If it's a runtime exception but NOT quota, pass it to global
        return handleGlobalException(ex, request);
    }

    /**
     * Handles specific business logic errors.
     * Logged as INFO to track business-level rejections.
     */
    @ExceptionHandler(AdvisoryException.class)
    public ResponseEntity<ErrorDetails> handleAdvisoryException(AdvisoryException ex, WebRequest request) {
        log.info("ADVISORY BUSINESS ERROR | Request: {} | Message: {}", request.getDescription(false), ex.getMessage());

        ErrorDetails errorDetails = new ErrorDetails(
                new Date(),
                ex.getMessage(),
                request.getDescription(false)
        );
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }

    /**
     * Catches any other unexpected errors (NullPointer, SQL errors, etc.)
     * Logged as ERROR with full stack trace for debugging.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDetails> handleGlobalException(Exception ex, WebRequest request) {
        log.error("CRITICAL SYSTEM ERROR | Request: {} | Cause: ", request.getDescription(false), ex);

        ErrorDetails errorDetails = new ErrorDetails(
                new Date(),
                "A system error occurred. Please check the backend logs.",
                request.getDescription(false)
        );
        return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}