package com.Wealth.Project.Exception;

// FIX: Must extend RuntimeException
public class ResourceNotFound extends RuntimeException {
    public ResourceNotFound(String message) {
        super(message);
    }
}