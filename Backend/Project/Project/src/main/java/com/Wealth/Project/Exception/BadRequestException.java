package com.Wealth.Project.Exception;

// FIX: Must extend RuntimeException
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}