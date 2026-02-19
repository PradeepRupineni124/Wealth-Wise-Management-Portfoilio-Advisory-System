# Compliance Service - WealthWise

Compliance and Regulatory Management Microservice for the WealthWise Platform.

## Overview

This service manages all compliance and regulatory aspects including:
- Compliance rules and regulations management
- Automated compliance checks
- Violation tracking and resolution
- Compliance reporting
- Audit trail logging
- Regulatory compliance monitoring

## Features

- **Compliance Rules Management**: Create and manage regulatory compliance rules
- **Automated Checks**: Perform compliance checks on various entities (portfolios, transactions, users)
- **Violation Tracking**: Track and manage compliance violations
- **Compliance Reports**: Generate comprehensive compliance reports
- **Audit Trail**: Complete audit logging of all compliance activities
- **Statistics Dashboard**: Real-time compliance metrics and statistics
- **Multi-Category Support**: KYC, AML, Trading, Reporting, Data Privacy, Risk Management, Tax Compliance, etc.
- **Severity Levels**: Track violations by severity (Low, Medium, High, Critical)

## Technology Stack

- Java 25
- Spring Boot 4.0.2
- Spring Cloud (Eureka Client)
- Spring Data JPA
- MySQL Database
- Spring Security
- Lombok

## Prerequisites

- JDK 25
- Maven 3.x
- MySQL 8.x
- Running Eureka Server (port 8761)

## Configuration

The service runs on port **8084** by default.

Database configuration in `application.yaml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/wealthwise_compliance?createDatabaseIfNotExist=true
    username: root
    password: root
```

## Running the Application

1. Ensure MySQL is running
2. Ensure Eureka Server is running on port 8761
3. Navigate to the Compliance directory
4. Run:
```bash
mvnw spring-boot:run
```

Or using Maven:
```bash
mvn spring-boot:run
```

## API Endpoints

### Compliance Rules

- `POST /api/compliance/rules` - Create new compliance rule
- `GET /api/compliance/rules` - Get all compliance rules
- `GET /api/compliance/rules/active` - Get active rules
- `GET /api/compliance/rules/{id}` - Get rule by ID
- `GET /api/compliance/rules/category/{category}` - Get rules by category
- `PUT /api/compliance/rules/{id}` - Update rule
- `DELETE /api/compliance/rules/{id}` - Delete rule

### Compliance Checks

- `POST /api/compliance/checks` - Create new compliance check
- `GET /api/compliance/checks` - Get all checks
- `GET /api/compliance/checks/{id}` - Get check by ID
- `GET /api/compliance/checks/user/{userId}` - Get checks by user
- `GET /api/compliance/checks/status/{status}` - Get checks by status
- `GET /api/compliance/checks/entity/{entityType}/{entityId}` - Get checks by entity
- `PATCH /api/compliance/checks/{id}/status/{status}` - Update check status
- `POST /api/compliance/checks/{id}/resolve` - Resolve a check

### Compliance Reports

- `POST /api/compliance/reports` - Generate new compliance report
- `GET /api/compliance/reports` - Get all reports
- `GET /api/compliance/reports/{id}` - Get report by ID
- `PATCH /api/compliance/reports/{id}/status/{status}` - Update report status

### Statistics & Audit

- `GET /api/compliance/statistics` - Get compliance statistics
- `GET /api/compliance/audit/user/{userId}` - Get audit trail for user
- `GET /api/compliance/audit/entity/{entityType}/{entityId}` - Get audit trail for entity

## Database Schema

### Compliance Rules Table
- id, ruleCode, ruleName, description
- category, severity, isActive
- regulatoryReference, penaltyDescription
- createdAt, updatedAt

### Compliance Checks Table
- id, userId, ruleId, entityType, entityId
- status, checkDetails, violationDetails, remedialAction
- checkDate, resolvedDate, resolvedBy, resolutionNotes
- createdAt, updatedAt

### Compliance Reports Table
- id, reportNumber, reportTitle, reportType
- reportPeriodStart, reportPeriodEnd
- totalChecks, passedChecks, failedChecks, pendingChecks
- complianceScore, status, summary, recommendations
- generatedBy, reviewedBy, reviewedDate
- createdAt, updatedAt

### Audit Trails Table
- id, userId, userName, action
- entityType, entityId, description
- previousValue, newValue
- ipAddress, userAgent, status, timestamp

## Rule Categories

- KYC (Know Your Customer)
- AML (Anti-Money Laundering)
- TRADING
- REPORTING
- DATA_PRIVACY
- RISK_MANAGEMENT
- TAX_COMPLIANCE
- INVESTMENT_SUITABILITY
- DISCLOSURE
- OTHER

## Check Status Types

- PENDING
- PASSED
- FAILED
- UNDER_REVIEW
- RESOLVED
- EXEMPTED

## Report Types

- DAILY
- WEEKLY
- MONTHLY
- QUARTERLY
- ANNUAL
- AD_HOC
- REGULATORY

## Service Registration

This service automatically registers with Eureka Server as `compliance-service`.

## Security

Currently configured with permissive access for development. JWT authentication can be integrated with the gateway service.

## Error Handling

Global exception handling for:
- Resource not found (404)
- Bad requests (400)
- Validation errors (400)
- Internal server errors (500)
