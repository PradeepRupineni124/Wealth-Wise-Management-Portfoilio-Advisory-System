package com.wealthwise.analytics.exception;

public class PortfolioDataUnavailableException extends RuntimeException {
    public PortfolioDataUnavailableException(String message) {
        super(message);
    }

    public PortfolioDataUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}

