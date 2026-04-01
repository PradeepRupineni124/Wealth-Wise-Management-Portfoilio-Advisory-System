# WealthWise Compliance Service

## Overview
Standalone Spring Boot 3.x microservice for compliance management and regulatory oversight in the WealthWise platform.

## Technology Stack
- **Java**: 17
- **Spring Boot**: 3.2.2
- **Database**: MySQL 8.x
- **ORM**: Spring Data JPA / Hibernate
- **Build Tool**: Maven
- **Architecture**: Standalone (No Eureka/Gateway)

## Features
✅ **Compliance Dashboard Metrics**
- Real-time compliance score calculation
- Active checks monitoring
- Action items tracking
- Report generation metrics

✅ **Risk Analysis**
- Single Asset Exposure calculation
- Sector Concentration monitoring
- Leverage Ratio analysis
- Liquidity Coverage tracking

✅ **Audit Log Management**
- Complete CRUD operations
- Regulation tracking (SEC, AML/CTF, GDPR, MiFID II, etc.)
- Compliance status monitoring
- Review scheduling

## Database Configuration

### Database Name
```
wealthwise_compliance
```

### Configuration (application.properties)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/wealthwise_compliance?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=update
```

## Running the Application

### Prerequisites
- JDK 17 installed
- MySQL 8.x running on localhost:3306
- Maven installed (or use included mvnw)

### Steps
1. **Start MySQL Server**
   ```bash
   # Ensure MySQL is running
   ```

2. **Load Sample Data** (Optional)
   ```bash
   mysql -u root -p < src/main/resources/sample-data.sql
   ```

3. **Run Application**
   ```bash
   # Using Maven Wrapper (Recommended)
   ./mvnw spring-boot:run
   
   # Or using installed Maven
   mvn spring-boot:run
   ```

4. **Verify Application**
   - Application starts on port: **8084**
   - Access: http://localhost:8084/api/compliance/summary

## API Endpoints

### Dashboard Metrics
```http
GET /api/compliance/summary
```
Returns compliance score and dashboard card metrics.

**Response:**
```json
{
  "complianceScore": 73,
  "activeChecks": 15,
  "actionRequired": 4,
  "reportsGenerated": 11
}
```

### Audit Logs
```http
GET /api/compliance/audit-logs
```
Returns full list of compliance audit logs from MySQL.

**Response:**
```json
[
  {
    "id": 1,
    "reviewType": "Quarterly Review",
    "regulation": "SEC Rule 15c3-3",
    "status": true,
    "findings": "Customer Reserve Formula compliant...",
    "reviewDate": "2026-01-15",
    "nextReview": "2026-04-15"
  }
]
```

### Risk Metrics
```http
GET /api/compliance/risk-metrics
```
Returns calculated risk analysis values.

**Response:**
```json
{
  "singleAssetExposure": 25.0,
  "sectorConcentration": 35.0,
  "leverageRatio": 0.3,
  "liquidityCoverage": 60.0
}
```

### Additional Endpoints

```http
# Get specific audit log by ID
GET /api/compliance/audit-logs/{id}

# Get logs requiring action
GET /api/compliance/audit-logs/action-required

# Get upcoming reviews (within 30 days)
GET /api/compliance/audit-logs/upcoming-reviews

# Create new audit log
POST /api/compliance/audit-logs

# Update audit log
PUT /api/compliance/audit-logs/{id}

# Delete audit log
DELETE /api/compliance/audit-logs/{id}
```

## Business Logic

### Compliance Score Calculation
```
Compliance Score = (Compliant Logs / Total Logs) × 100
```

### Risk Metrics Formulas

**Single Asset Exposure:**
```
(Largest Asset Value / Total Portfolio Value) × 100
```

**Sector Concentration:**
```
(Largest Sector Value / Total Portfolio Value) × 100
```

**Leverage Ratio:**
```
Total Debt / Total Equity
```

**Liquidity Coverage:**
```
(Liquid Assets / Total Assets) × 100
```

## Project Structure
```
Compliance/
├── src/
│   ├── main/
│   │   ├── java/com/wealthwise/compliance/
│   │   │   ├── ComplianceServiceApplication.java
│   │   │   ├── controller/
│   │   │   │   └── ComplianceController.java
│   │   │   ├── service/
│   │   │   │   └── ComplianceService.java
│   │   │   ├── repository/
│   │   │   │   └── ComplianceAuditLogRepository.java
│   │   │   ├── entity/
│   │   │   │   └── ComplianceAuditLog.java
│   │   │   └── dto/
│   │   │       ├── ComplianceSummaryDTO.java
│   │   │       └── RiskAnalysisDTO.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── sample-data.sql
│   └── test/
├── pom.xml
└── README.md
```

## Sample Data
The service includes sample data for 15 compliance regulations:
- SEC Rule 15c3-3
- AML/CTF
- GDPR Compliance
- MiFID II
- Capital Adequacy
- Market Abuse Regulation
- Solvency II
- Dodd-Frank Act
- FATCA
- Liquidity Coverage Ratio
- Basel III
- IFRS 9
- SOX Compliance
- EMIR
- Net Stable Funding Ratio

## Testing the API

### Using cURL
```bash
# Get compliance summary
curl http://localhost:8084/api/compliance/summary

# Get all audit logs
curl http://localhost:8084/api/compliance/audit-logs

# Get risk metrics
curl http://localhost:8084/api/compliance/risk-metrics
```

### Using Browser
Navigate to:
- http://localhost:8084/api/compliance/summary
- http://localhost:8084/api/compliance/audit-logs
- http://localhost:8084/api/compliance/risk-metrics

## Integration with Angular Frontend
The service is configured with CORS support for `http://localhost:4200`.

Angular service can call:
```typescript
this.http.get('http://localhost:8084/api/compliance/summary')
this.http.get('http://localhost:8084/api/compliance/audit-logs')
this.http.get('http://localhost:8084/api/compliance/risk-metrics')
```

## Logging
Debug logging enabled for:
- Application logic: `com.wealthwise.compliance`
- SQL queries: `org.hibernate.SQL`
- SQL parameters: `org.hibernate.type.descriptor.sql.BasicBinder`

## Production Considerations
1. **Security**: Add Spring Security for authentication/authorization
2. **Risk Data**: Replace simulated risk calculations with actual portfolio data
3. **Database**: Configure production MySQL credentials
4. **Monitoring**: Add Spring Boot Actuator for health checks
5. **API Documentation**: Add Swagger/OpenAPI documentation

## License
Part of the WealthWise Platform - Cognizant 2026
