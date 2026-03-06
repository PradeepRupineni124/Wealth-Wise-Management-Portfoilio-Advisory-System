-- ============================================================
-- WealthWise Compliance Database - Sample Data Script
-- Database: wealthwise_compliance
-- ============================================================

-- Create database if not exists (Spring Boot will auto-create with properties)
CREATE DATABASE IF NOT EXISTS wealthwise_compliance;
USE wealthwise_compliance;

-- Table will be auto-created by Hibernate with spring.jpa.hibernate.ddl-auto=update
-- But here's the manual schema for reference:

-- DROP TABLE IF EXISTS compliance_audit_logs;
-- CREATE TABLE compliance_audit_logs (
--     id BIGINT AUTO_INCREMENT PRIMARY KEY,
--     review_type VARCHAR(100) NOT NULL,
--     regulation VARCHAR(200) NOT NULL,
--     status BOOLEAN NOT NULL,
--     findings VARCHAR(1000),
--     review_date DATE NOT NULL,
--     next_review DATE NOT NULL
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Sample Data Matching UI Screenshots
-- ============================================================

-- Insert sample compliance audit logs
INSERT INTO compliance_audit_logs (client_id, review_type, regulation, status, findings, review_date, next_review)
 VALUES
 (1, 'Portfolio Review', 'SEC Rule 15c3-3', true, 'Compliant', '2026-01-05', '2026-04-05'),
 (1, 'Risk Assessment', 'Basel III', true, 'Compliant', '2026-01-03', '2026-02-03'),
 (1, 'KYC Verification', 'AML/CTF', false, 'Action Required', '2025-12-28', '2026-01-13'),
 (1, 'Investment Limits', 'FINRA Rule 2111', true, 'Compliant', '2025-12-20', '2026-03-20'),
 (1, 'Disclosure Requirements', 'Form ADV Part 2', true, 'Compliant', '2025-12-15', '2026-12-15');

-- ============================================================
-- Verification Queries
-- ============================================================

-- View all audit logs
-- SELECT * FROM compliance_audit_logs ORDER BY review_date DESC;

-- Count compliant vs non-compliant
-- SELECT 
--     SUM(CASE WHEN status = true THEN 1 ELSE 0 END) AS compliant_count,
--     SUM(CASE WHEN status = false THEN 1 ELSE 0 END) AS action_required_count,
--     COUNT(*) AS total_count,
--     ROUND((SUM(CASE WHEN status = true THEN 1 ELSE 0 END) / COUNT(*)) * 100, 0) AS compliance_score
-- FROM compliance_audit_logs;

-- Show logs requiring action
-- SELECT * FROM compliance_audit_logs WHERE status = false;

-- Show upcoming reviews (within 30 days)
-- SELECT * FROM compliance_audit_logs 
-- WHERE next_review BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
-- ORDER BY next_review;

-- ============================================================
-- End of Sample Data Script
-- ============================================================
