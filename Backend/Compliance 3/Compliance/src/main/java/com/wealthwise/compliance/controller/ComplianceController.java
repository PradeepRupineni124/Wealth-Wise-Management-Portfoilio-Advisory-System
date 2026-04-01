package com.wealthwise.compliance.controller;

import com.wealthwise.compliance.dto.ComplianceSummaryDTO;
import com.wealthwise.compliance.dto.RiskAnalysisDTO;
import com.wealthwise.compliance.entity.ComplianceAuditLog;
import com.wealthwise.compliance.service.ComplianceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

/**
 * REST Controller for Compliance Management
 * Provides endpoints for compliance dashboard, audit logs, and risk metrics
 */
@RestController
@RequestMapping("/api/compliance")
@RequiredArgsConstructor
@Slf4j
public class ComplianceController {

    private final ComplianceService complianceService;

    /**
     * GET /api/compliance/summary
     * Returns dashboard summary with compliance score and card counts
     * 
     * @return ComplianceSummaryDTO with calculated metrics
     */
    @GetMapping("/summary/{clientId}")
    public ResponseEntity<ComplianceSummaryDTO> getComplianceSummary(@PathVariable Long clientId) {
        log.info("GET /api/compliance/summary/{} - Fetching summary for client", clientId);
        // Updated to call client-specific service method
        ComplianceSummaryDTO summary = complianceService.getComplianceSummaryByClient(clientId);
        return ResponseEntity.ok(summary);
    }

    /**
     * GET /api/compliance/audit-logs
     * Returns the full list of compliance audit logs from MySQL
     * 
     * @return List of all ComplianceAuditLog entries
     */
     @GetMapping("/audit-logs")
    public ResponseEntity<List<ComplianceAuditLog>> getAllAuditLogs() {
        log.info("GET /api/compliance/audit-logs - Fetching all audit logs");
        List<ComplianceAuditLog> logs = complianceService.getAllAuditLogs();
        return ResponseEntity.ok(logs);
    }

    /**
     * GET /api/compliance/risk-metrics
     * Returns calculated risk analysis values for progress bars
     * 
     * @return RiskAnalysisDTO with risk metrics
     */
    @GetMapping("/risk-metrics/{clientId}")
    public ResponseEntity<RiskAnalysisDTO> getRiskMetrics(@PathVariable Long clientId) {
        log.info("GET /api/compliance/risk-metrics/{} - Fetching risk metrics for client", clientId);
        // Updated to call client-specific service method
        RiskAnalysisDTO riskMetrics = complianceService.getRiskMetricsByClient(clientId);
        return ResponseEntity.ok(riskMetrics);
    }

    /**
     * GET /api/compliance/audit-logs/{id}
     * Get a specific audit log by ID
     * 
     * @param id Audit log ID
     * @return ComplianceAuditLog or 404 if not found
     */
    @GetMapping("/audit-logs/client/{clientId}")
    public ResponseEntity<List<ComplianceAuditLog>> getAuditLogsByClient(@PathVariable Long clientId) {
        log.info("GET /api/compliance/audit-logs/client/{} - Fetching client logs", clientId);
        List<ComplianceAuditLog> logs = complianceService.getAuditLogsByClientId(clientId);
        return ResponseEntity.ok(logs);
    }

    /**
     * GET /api/compliance/audit-logs/action-required
     * Get all logs requiring action (status = false)
     * 
     * @return List of non-compliant audit logs
     */
    @GetMapping("/audit-logs/action-required")
    public ResponseEntity<List<ComplianceAuditLog>> getLogsRequiringAction() {
        log.info("GET /api/compliance/audit-logs/action-required - Fetching logs requiring action");
        List<ComplianceAuditLog> logs = complianceService.getLogsRequiringAction();
        return ResponseEntity.ok(logs);
    }

    /**
     * GET /api/compliance/audit-logs/upcoming-reviews
     * Get logs with upcoming reviews (within 30 days)
     * 
     * @return List of audit logs with upcoming reviews
     */
    @GetMapping("/audit-logs/upcoming-reviews")
    public ResponseEntity<List<ComplianceAuditLog>> getUpcomingReviews() {
        log.info("GET /api/compliance/audit-logs/upcoming-reviews - Fetching upcoming reviews");
        List<ComplianceAuditLog> logs = complianceService.getUpcomingReviews();
        return ResponseEntity.ok(logs);
    }

    /**
        * GET /api/compliance/audit-logs/compliant
        * Get all compliant logs (status = true)
        *
        * @return List of compliant audit logs
        */
    /**
     * POST /api/compliance/run-audit/{clientId}
     * Execute full compliance audit for a specific client
     * Runs all 5 compliance rules and creates 5 distinct audit logs
     */
    @PostMapping("/run-audit/{clientId}")
    public ResponseEntity<List<ComplianceAuditLog>> runComplianceAudit(@PathVariable Long clientId) {
        log.info("POST /api/compliance/run-audit/{} - Running full compliance audit", clientId);
        List<ComplianceAuditLog> auditLogs = complianceService.runFullComplianceAudit(clientId);
        return ResponseEntity.status(HttpStatus.CREATED).body(auditLogs);
    }

    /**
     * POST /api/compliance/audit-logs
     * Create a new audit log entry
     * 
     * @param auditLog ComplianceAuditLog to create
     * @return Created ComplianceAuditLog with 201 status
     */
    @PostMapping("/audit-logs")
    public ResponseEntity<ComplianceAuditLog> createAuditLog(@Valid @RequestBody ComplianceAuditLog auditLog) {
        log.info("POST /api/compliance/audit-logs - Creating new audit log");
        ComplianceAuditLog created = complianceService.createAuditLog(auditLog);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * PUT /api/compliance/audit-logs/{id}
     * Update an existing audit log
     * 
     * @param id Audit log ID
     * @param auditLog Updated audit log data
     * @return Updated ComplianceAuditLog or 404 if not found
     */
    @PutMapping("/audit-logs/{id}")
    public ResponseEntity<ComplianceAuditLog> updateAuditLog(
            @PathVariable Long id,
            @Valid @RequestBody ComplianceAuditLog auditLog) {
        log.info("PUT /api/compliance/audit-logs/{} - Updating audit log", id);
        ComplianceAuditLog updated = complianceService.updateAuditLog(id, auditLog);
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/compliance/audit-logs/{id}
     * Delete an audit log by ID
     * 
     * @param id Audit log ID to delete
     * @return 204 No Content on success
     */
    @DeleteMapping("/audit-logs/{id}")
    public ResponseEntity<Void> deleteAuditLog(@PathVariable Long id) {
        log.info("DELETE /api/compliance/audit-logs/{} - Deleting audit log", id);
        complianceService.deleteAuditLog(id);
        return ResponseEntity.noContent().build();
    }
}
