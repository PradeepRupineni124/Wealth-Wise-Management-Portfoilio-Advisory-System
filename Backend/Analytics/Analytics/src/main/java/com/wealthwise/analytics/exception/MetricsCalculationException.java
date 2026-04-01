package com.wealthwise.analytics.exception;

public class MetricsCalculationException extends RuntimeException {
    public MetricsCalculationException(String message) {
        super(message);
    }

    public MetricsCalculationException(String message, Throwable cause) {
        super(message, cause);
    }
}

