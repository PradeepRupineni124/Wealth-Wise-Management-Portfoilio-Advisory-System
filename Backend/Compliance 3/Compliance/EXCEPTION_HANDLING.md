# WealthWise Compliance - Global Exception Handling Documentation

## Overview
This document describes the comprehensive exception handling layer implemented for the WealthWise Compliance microservice using Spring Boot 3.x and Java 17.

## Architecture Components

### 1. Custom Exception Classes

#### ResourceNotFoundException
**Package:** `com.wealthwise.compliance.exception`

**Purpose:** Thrown when requested audit logs or resources cannot be found in the database.

**HTTP Status:** 404 Not Found

**Usage Example:**
```java
throw new ResourceNotFoundException("ComplianceAuditLog", id);
```

**Constructors:**
- `ResourceNotFoundException(String message)`
- `ResourceNotFoundException(String message, Throwable cause)`
- `ResourceNotFoundException(Long id)`
- `ResourceNotFoundException(String resourceName, Long id)`
- `ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue)`

---

#### ComplianceCalculationException
**Package:** `com.wealthwise.compliance.exception`

**Purpose:** Thrown when risk math calculations fail due to invalid data (e.g., division by zero).

**HTTP Status:** 400 Bad Request

**Usage Example:**
```java
throw new ComplianceCalculationException("Risk Metrics", "Total portfolio value must be greater than zero");
```

**Constructors:**
- `ComplianceCalculationException(String message)`
- `ComplianceCalculationException(String message, Throwable cause)`
- `ComplianceCalculationException(String calculationType, String reason)`

---

### 2. Error Response Model

#### ErrorResponse DTO
**Package:** `com.wealthwise.compliance.dto`

**Purpose:** Provides consistent error response structure across all API endpoints.

**Fields:**
```java
{
  "timestamp": "2026-02-22T10:30:45.123",
  "status": 404,
  "error": "Not Found",
  "message": "ComplianceAuditLog not found with id: 999",
  "path": "/api/compliance/audit-logs/999"
}
```

| Field | Type | Description |
|-------|------|-------------|
| timestamp | LocalDateTime | When the error occurred |
| status | int | HTTP status code |
| error | String | HTTP status description |
| message | String | Detailed error message |
| path | String | Request path that caused the error |

---

### 3. Global Exception Handler

#### GlobalExceptionHandler
**Package:** `com.wealthwise.compliance.exception`

**Annotation:** `@RestControllerAdvice`

**Purpose:** Centralized exception handling across all controllers.

**Exception Handlers:**

##### 1. ResourceNotFoundException Handler
```java
@ExceptionHandler(ResourceNotFoundException.class)
```
- **HTTP Status:** 404 Not Found
- **Response:** ErrorResponse DTO
- **Use Case:** Missing audit logs, non-existent resources

**Example Response:**
```json
{
  "timestamp": "2026-02-22T10:30:45.123",
  "status": 404,
  "error": "Not Found",
  "message": "ComplianceAuditLog not found with id: 999",
  "path": "/api/compliance/audit-logs/999"
}
```

##### 2. ComplianceCalculationException Handler
```java
@ExceptionHandler(ComplianceCalculationException.class)
```
- **HTTP Status:** 400 Bad Request
- **Response:** ErrorResponse DTO
- **Use Case:** Division by zero, invalid portfolio data

**Example Response:**
```json
{
  "timestamp": "2026-02-22T10:35:12.456",
  "status": 400,
  "error": "Bad Request",
  "message": "Failed to calculate Risk Metrics: Total portfolio value must be greater than zero",
  "path": "/api/compliance/risk-metrics"
}
```

##### 3. MethodArgumentNotValidException Handler
```java
@ExceptionHandler(MethodArgumentNotValidException.class)
```
- **HTTP Status:** 400 Bad Request
- **Response:** ErrorResponse DTO with field-level validation errors
- **Use Case:** Bean validation failures

**Example Response:**
```json
{
  "timestamp": "2026-02-22T10:40:30.789",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed: reviewType - Review type is required; status - Status is required",
  "path": "/api/compliance/audit-logs"
}
```

##### 4. IllegalArgumentException Handler
```java
@ExceptionHandler(IllegalArgumentException.class)
```
- **HTTP Status:** 400 Bad Request
- **Response:** ErrorResponse DTO
- **Use Case:** Invalid method arguments

##### 5. Global Exception Handler (Catch-All)
```java
@ExceptionHandler(Exception.class)
```
- **HTTP Status:** 500 Internal Server Error
- **Response:** ErrorResponse DTO
- **Use Case:** Unexpected errors

**Example Response:**
```json
{
  "timestamp": "2026-02-22T10:45:15.321",
  "status": 500,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred: Database connection failed",
  "path": "/api/compliance/summary"
}
```

---

## Service Layer Integration

### ComplianceService Updates

#### 1. Risk Metrics Calculation with Validation
```java
public RiskAnalysisDTO getRiskMetrics() {
    // Validate totalPortfolioValue to prevent division by zero
    if (totalPortfolioValue <= 0) {
        throw new ComplianceCalculationException(
            "Risk Metrics", 
            "Total portfolio value must be greater than zero"
        );
    }
    
    // Validate totalEquity for leverage ratio
    if (totalEquity <= 0) {
        throw new ComplianceCalculationException(
            "Leverage Ratio", 
            "Total equity must be greater than zero"
        );
    }
    
    // Validate totalAssets for liquidity coverage
    if (totalAssets <= 0) {
        throw new ComplianceCalculationException(
            "Liquidity Coverage", 
            "Total assets must be greater than zero"
        );
    }
    
    // Proceed with calculations...
}
```

#### 2. Resource Retrieval with Exception Handling
```java
public ComplianceAuditLog getAuditLogById(Long id) {
    return auditLogRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("ComplianceAuditLog", id));
}

public ComplianceAuditLog updateAuditLog(Long id, ComplianceAuditLog auditLog) {
    if (!auditLogRepository.existsById(id)) {
        throw new ResourceNotFoundException("ComplianceAuditLog", id);
    }
    // Update logic...
}

public void deleteAuditLog(Long id) {
    if (!auditLogRepository.existsById(id)) {
        throw new ResourceNotFoundException("ComplianceAuditLog", id);
    }
    // Delete logic...
}
```

---

## Entity Validation

### ComplianceAuditLog Validation Annotations

```java
@NotBlank(message = "Review type is required")
@Size(min = 3, max = 100, message = "Review type must be between 3 and 100 characters")
private String reviewType;

@NotBlank(message = "Regulation is required")
@Size(min = 3, max = 200, message = "Regulation must be between 3 and 200 characters")
private String regulation;

@NotNull(message = "Status is required")
private Boolean status;

@Size(max = 1000, message = "Findings cannot exceed 1000 characters")
private String findings;

@NotNull(message = "Review date is required")
private LocalDate reviewDate;

@NotNull(message = "Next review date is required")
private LocalDate nextReview;
```

---

## Controller Layer Updates

### Simplified Controller Methods

Controllers no longer need null checks or manual error handling. Exceptions are automatically caught by `GlobalExceptionHandler`.

**Before:**
```java
@GetMapping("/audit-logs/{id}")
public ResponseEntity<ComplianceAuditLog> getAuditLogById(@PathVariable Long id) {
    ComplianceAuditLog log = complianceService.getAuditLogById(id);
    if (log != null) {
        return ResponseEntity.ok(log);
    }
    return ResponseEntity.notFound().build();
}
```

**After:**
```java
@GetMapping("/audit-logs/{id}")
public ResponseEntity<ComplianceAuditLog> getAuditLogById(@PathVariable Long id) {
    ComplianceAuditLog auditLog = complianceService.getAuditLogById(id);
    return ResponseEntity.ok(auditLog);
}
```

---

## Testing the Exception Handling

### Test Cases

#### 1. Test ResourceNotFoundException
```bash
# Request non-existent audit log
curl http://localhost:8084/api/compliance/audit-logs/9999

# Expected Response: 404 Not Found
{
  "timestamp": "2026-02-22T10:30:45.123",
  "status": 404,
  "error": "Not Found",
  "message": "ComplianceAuditLog not found with id: 9999",
  "path": "/api/compliance/audit-logs/9999"
}
```

#### 2. Test ComplianceCalculationException
```bash
# Trigger calculation error (modify service to set totalPortfolioValue = 0)
curl http://localhost:8084/api/compliance/risk-metrics

# Expected Response: 400 Bad Request
{
  "timestamp": "2026-02-22T10:35:12.456",
  "status": 400,
  "error": "Bad Request",
  "message": "Failed to calculate Risk Metrics: Total portfolio value must be greater than zero",
  "path": "/api/compliance/risk-metrics"
}
```

#### 3. Test Validation Exception
```bash
# POST with missing required fields
curl -X POST http://localhost:8084/api/compliance/audit-logs \
  -H "Content-Type: application/json" \
  -d '{}'

# Expected Response: 400 Bad Request
{
  "timestamp": "2026-02-22T10:40:30.789",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed: reviewType - Review type is required; regulation - Regulation is required; status - Status is required; reviewDate - Review date is required; nextReview - Next review date is required",
  "path": "/api/compliance/audit-logs"
}
```

#### 4. Test Validation - Invalid Size
```bash
# POST with invalid data
curl -X POST http://localhost:8084/api/compliance/audit-logs \
  -H "Content-Type: application/json" \
  -d '{
    "reviewType": "Ab",
    "regulation": "SEC",
    "status": true,
    "reviewDate": "2026-01-15",
    "nextReview": "2026-04-15"
  }'

# Expected Response: 400 Bad Request
{
  "timestamp": "2026-02-22T10:42:15.123",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed: reviewType - Review type must be between 3 and 100 characters; regulation - Regulation must be between 3 and 200 characters",
  "path": "/api/compliance/audit-logs"
}
```

---

## Benefits

### 1. Consistency
- All error responses follow the same structure
- Predictable error handling across the entire API

### 2. Clean Code
- Controllers are simplified (no null checks)
- Business logic focuses on functionality, not error handling

### 3. Developer Experience
- Clear error messages for debugging
- Detailed validation feedback
- Timestamps for tracking issues

### 4. Client Experience
- Meaningful error messages
- Proper HTTP status codes
- Field-level validation details

### 5. Maintainability
- Centralized exception handling
- Easy to add new exception types
- Consistent logging

---

## Best Practices

### 1. Always Use Specific Exceptions
```java
// Good
throw new ResourceNotFoundException("ComplianceAuditLog", id);

// Avoid
throw new RuntimeException("Not found");
```

### 2. Provide Context in Error Messages
```java
// Good
throw new ComplianceCalculationException("Risk Metrics", "Total portfolio value must be greater than zero");

// Avoid
throw new ComplianceCalculationException("Error");
```

### 3. Log Exceptions Appropriately
- Use `log.error()` for 500 errors
- Use `log.warn()` for 400 errors
- Use `log.debug()` for expected exceptions

### 4. Never Expose Sensitive Information
- Sanitize error messages
- Avoid stack traces in production
- Don't leak database details

---

## Future Enhancements

1. **Custom Validation Annotations**
   - Create `@FutureReviewDate` for nextReview validation
   - Create `@ValidRegulation` for regulation format

2. **Error Codes**
   - Add error codes to ErrorResponse (e.g., "COMP-404-001")
   - Create error code catalog

3. **Internationalization**
   - Support multiple languages for error messages
   - Use message bundles

4. **Rate Limiting Exceptions**
   - Handle 429 Too Many Requests
   - Provide retry-after headers

5. **Circuit Breaker Integration**
   - Handle service unavailable scenarios
   - Graceful degradation

---

## Summary

The global exception handling layer provides:
- ✅ **ResourceNotFoundException** for 404 errors
- ✅ **ComplianceCalculationException** for 400 calculation errors
- ✅ **MethodArgumentNotValidException** handling for validation
- ✅ **ErrorResponse DTO** for consistent responses
- ✅ **GlobalExceptionHandler** with @RestControllerAdvice
- ✅ **Service layer integration** with proper exception throwing
- ✅ **Entity validation** with Jakarta validation annotations
- ✅ **Simplified controllers** without null checks

All exceptions return the ErrorResponse DTO with proper HTTP status codes, making the API robust, maintainable, and developer-friendly.
