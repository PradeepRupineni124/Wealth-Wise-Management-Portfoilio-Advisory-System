package com.wealthwise.compliance.exception;

/**
 * Custom exception for compliance calculation errors
 * Thrown when risk math calculations fail (e.g., division by zero, invalid data)
 */
public class ComplianceCalculationException extends RuntimeException {

    public ComplianceCalculationException(String message) {
        super(message);
    }

    public ComplianceCalculationException(String message, Throwable cause) {
        super(message, cause);
    }

    public ComplianceCalculationException(String calculationType, String reason) {
        super(String.format("Failed to calculate %s: %s", calculationType, reason));
    }
}
