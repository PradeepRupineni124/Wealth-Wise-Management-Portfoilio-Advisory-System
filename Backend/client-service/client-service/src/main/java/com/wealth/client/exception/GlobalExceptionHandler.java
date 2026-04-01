package com.wealth.client.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // 1. Handle Validation Errors (e.g., @Valid constraints failing on DTOs)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        log.warn("Validation error occurred: {}", ex.getMessage());

        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }

        Map<String, Object> errorResponse = buildErrorResponse(
                "Validation Failed",
                HttpStatus.BAD_REQUEST,
                fieldErrors
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    // 2. Handle File Upload Size Exceeded (Crucial for your KYC doc uploads)
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, Object>> handleMaxSizeException(MaxUploadSizeExceededException ex) {
        log.error("File size exceeded: ", ex);

        Map<String, Object> errorResponse = buildErrorResponse(
                "File size exceeds the allowable limit. Please upload a smaller file.",
                HttpStatus.PAYLOAD_TOO_LARGE,
                null
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.PAYLOAD_TOO_LARGE);
    }

    // 3. Handle Database Conflicts (e.g., trying to save a duplicate email address)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        log.error("Database conflict: ", ex);

        Map<String, Object> errorResponse = buildErrorResponse(
                "A database conflict occurred. This data might already exist (e.g., duplicate email).",
                HttpStatus.CONFLICT,
                null
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

    // 4. Handle Illegal Arguments (Often thrown manually in services for bad logic)
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(IllegalArgumentException ex) {
        log.warn("Invalid argument passed: ", ex);

        Map<String, Object> errorResponse = buildErrorResponse(
                ex.getMessage(),
                HttpStatus.BAD_REQUEST,
                null
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    // 5. Catch-all for other RuntimeExceptions
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        log.error("Runtime Exception occurred: ", ex);

        Map<String, Object> errorResponse = buildErrorResponse(
                ex.getMessage(),
                HttpStatus.BAD_REQUEST,
                null
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    // 6. Absolute Fallback for completely unexpected Server Errors
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(Exception ex) {
        log.error("Unexpected Error: ", ex);

        Map<String, Object> errorResponse = buildErrorResponse(
                "An unexpected error occurred. Please contact support.",
                HttpStatus.INTERNAL_SERVER_ERROR,
                null
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // --- Helper Method to keep responses standardized and DRY ---
    private Map<String, Object> buildErrorResponse(String message, HttpStatus status, Object errors) {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("message", message);
        response.put("status", status.value());

        if (errors != null) {
            response.put("errors", errors); // Attach specific field errors if they exist
        }

        return response;
    }
}