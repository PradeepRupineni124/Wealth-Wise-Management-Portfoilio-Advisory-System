package com.wealthwise.compliance.scheduler;

import com.wealthwise.compliance.entity.ComplianceAuditLog;
import com.wealthwise.compliance.repository.ComplianceAuditLogRepository;
import com.wealthwise.compliance.service.ComplianceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Scheduler component for automated compliance audits
 * Runs daily at midnight to audit all clients in the system
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ComplianceScheduler {

    private final ComplianceService complianceService;
    private final ComplianceAuditLogRepository auditLogRepository;

    /**
     * Daily compliance audit task
     * Scheduled to run every day at 00:00:00 (midnight)
     * Fetches all distinct client IDs and runs full compliance audit for each
     */
    @Scheduled(cron = "0 0 0 * * ?")
    public void runDailyComplianceAudit() {
        log.info("🕐 Starting scheduled daily compliance audit task at midnight");

        try {
            // Fetch all distinct client IDs from previous audits
            List<Long> clientIds = auditLogRepository.findDistinctClientIds();

            if (clientIds == null || clientIds.isEmpty()) {
                log.warn("⚠️ No clients found for compliance audit");
                return;
            }

            log.info("📊 Running compliance audits for {} clients", clientIds.size());

            int successCount = 0;
            int failureCount = 0;

            // Execute full compliance audit for each client
            for (Long clientId : clientIds) {
                try {
                    log.debug("⏳ Processing client ID: {}", clientId);

                    // FIX: We now receive a List of 5 logs instead of a single log
                    List<ComplianceAuditLog> auditLogs = complianceService.runFullComplianceAudit(clientId);

                    // Check if ANY of the 5 rules failed (status == false)
                    boolean hasViolations = auditLogs.stream().anyMatch(log -> !log.getStatus());

                    if (!hasViolations) {
                        log.info("✅ Client {} audit PASSED all rules", clientId);
                        successCount++;
                    } else {
                        long violationCount = auditLogs.stream().filter(log -> !log.getStatus()).count();
                        log.warn("❌ Client {} audit FAILED with {} violations", clientId, violationCount);
                        failureCount++;
                    }

                } catch (Exception e) {
                    log.error("💥 Error auditing client {}: {}", clientId, e.getMessage());
                    failureCount++;
                    // Continue to next client instead of stopping
                    continue;
                }
            }

            log.info("✅ Daily compliance audit completed - Success: {}, Failures: {}", successCount, failureCount);

        } catch (Exception e) {
            log.error("💥 Fatal error in daily compliance audit scheduler: {}", e.getMessage(), e);
        }
    }
}