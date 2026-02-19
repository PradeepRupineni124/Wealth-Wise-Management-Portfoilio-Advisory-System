package com.Wealth.Compliance.repository;

import com.Wealth.Compliance.model.ComplianceCheck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ComplianceCheckRepository extends JpaRepository<ComplianceCheck, Long> {
    
    List<ComplianceCheck> findByUserId(Long userId);
    
    List<ComplianceCheck> findByRuleId(Long ruleId);
    
    List<ComplianceCheck> findByStatus(ComplianceCheck.CheckStatus status);
    
    List<ComplianceCheck> findByEntityTypeAndEntityId(String entityType, Long entityId);
    
    List<ComplianceCheck> findByUserIdAndStatus(Long userId, ComplianceCheck.CheckStatus status);
    
    List<ComplianceCheck> findByCheckDateBetween(LocalDateTime start, LocalDateTime end);
    
    Long countByStatus(ComplianceCheck.CheckStatus status);
    
    Long countByUserIdAndStatus(Long userId, ComplianceCheck.CheckStatus status);
}
