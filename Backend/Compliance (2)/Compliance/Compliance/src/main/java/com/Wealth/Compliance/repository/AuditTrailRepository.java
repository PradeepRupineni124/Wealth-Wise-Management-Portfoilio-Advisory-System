package com.Wealth.Compliance.repository;

import com.Wealth.Compliance.model.AuditTrail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditTrailRepository extends JpaRepository<AuditTrail, Long> {
    
    List<AuditTrail> findByUserId(Long userId);
    
    List<AuditTrail> findByEntityTypeAndEntityId(String entityType, Long entityId);
    
    List<AuditTrail> findByAction(String action);
    
    List<AuditTrail> findByTimestampBetween(LocalDateTime start, LocalDateTime end);
    
    List<AuditTrail> findByUserIdAndTimestampBetween(Long userId, LocalDateTime start, LocalDateTime end);
}
