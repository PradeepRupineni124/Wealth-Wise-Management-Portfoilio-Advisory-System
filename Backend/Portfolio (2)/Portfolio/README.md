# Portfolio Service - WealthWise

Portfolio Management Microservice for the WealthWise Platform.

## Overview

This service handles all portfolio-related operations including:
- Creating and managing user portfolios
- Adding and tracking portfolio holdings
- Real-time portfolio value calculations
- Performance analytics and returns tracking
- Risk level assessment

## Features

- **Portfolio Management**: Create, read, update, and delete portfolios
- **Holdings Management**: Add, update, and remove individual holdings
- **Automatic Calculations**: Profit/loss, returns, and portfolio metrics
- **Multi-Asset Support**: Stocks, bonds, mutual funds, ETFs, commodities, cryptocurrency, real estate, and cash
- **Risk Profiling**: Track portfolio risk levels (Low, Medium, High, Aggressive)

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

The service runs on port **8083** by default.

Database configuration in `application.yaml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/wealthwise_portfolio?createDatabaseIfNotExist=true
    username: root
    password: root
```

## Running the Application

1. Ensure MySQL is running
2. Ensure Eureka Server is running on port 8761
3. Navigate to the Portfolio directory
4. Run:
```bash
mvnw spring-boot:run
```

Or using Maven:
```bash
mvn spring-boot:run
```

## API Endpoints

### Portfolio Management

- `POST /api/portfolios` - Create new portfolio
- `GET /api/portfolios/user/{userId}` - Get all portfolios for a user
- `GET /api/portfolios/{id}` - Get portfolio by ID
- `PUT /api/portfolios/{id}` - Update portfolio
- `DELETE /api/portfolios/{id}` - Delete portfolio

### Holdings Management

- `POST /api/portfolios/holdings` - Add new holding
- `GET /api/portfolios/{portfolioId}/holdings` - Get all holdings for a portfolio
- `PUT /api/portfolios/holdings/{holdingId}` - Update holding
- `DELETE /api/portfolios/holdings/{holdingId}` - Delete holding

## Database Schema

### Portfolios Table
- id, userId, portfolioName, description
- totalValue, investedAmount, currentReturns, returnPercentage
- riskLevel, createdAt, updatedAt

### Portfolio Holdings Table
- id, portfolioId, assetSymbol, assetName, assetType
- quantity, purchasePrice, currentPrice
- totalInvested, currentValue, profitLoss, returnPercentage
- purchaseDate, createdAt, updatedAt

## Service Registration

This service automatically registers with Eureka Server as `portfolio-service`.

## Security

Currently configured with permissive access for development. JWT authentication can be integrated with the gateway service.

## Error Handling

Global exception handling for:
- Resource not found (404)
- Bad requests (400)
- Validation errors (400)
- Internal server errors (500)
