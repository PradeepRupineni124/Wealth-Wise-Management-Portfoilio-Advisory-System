package com.wealthwise.compliance.repository;

import com.wealthwise.compliance.entity.ComplianceAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository interface for ComplianceAuditLog entity
 * Provides CRUD operations and custom queries
 */
@Repository
public interface ComplianceAuditLogRepository extends JpaRepository<ComplianceAuditLog, Long> {

    long count();
    long countByClientId(Long clientId);
    long countByClientIdAndStatus(Long clientId, Boolean status);
    long countByStatus(Boolean status);

    List<ComplianceAuditLog> findAllByOrderByReviewDateDesc();

    // Ensures newest logs are at the top
    List<ComplianceAuditLog> findByClientIdOrderByIdDesc(Long clientId);

    List<ComplianceAuditLog> findByClientId(Long clientId);
    List<ComplianceAuditLog> findByReviewType(String reviewType);
    List<ComplianceAuditLog> findByRegulation(String regulation);
    List<ComplianceAuditLog> findByStatusFalse();
    List<ComplianceAuditLog> findByStatusTrue();
    List<ComplianceAuditLog> findByNextReviewBefore(LocalDate date);
    List<ComplianceAuditLog> findByReviewDateBetween(LocalDate startDate, LocalDate endDate);

    // NEW: Deletes old logs for a client before generating fresh ones
    void deleteByClientId(Long clientId);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT c.clientId FROM ComplianceAuditLog c ORDER BY c.clientId")
    List<Long> findDistinctClientIds();
}