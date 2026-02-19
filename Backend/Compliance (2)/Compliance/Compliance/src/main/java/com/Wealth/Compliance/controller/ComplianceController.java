package com.Wealth.Compliance.controller;

import com.Wealth.Compliance.dto.*;
import com.Wealth.Compliance.model.*;
import com.Wealth.Compliance.service.ComplianceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/compliance")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ComplianceController {

    private final ComplianceService complianceService;

    // ==================== Compliance Rules ====================

    @PostMapping("/rules")
    public ResponseEntity<ComplianceRule> createRule(@Valid @RequestBody ComplianceRuleRequest request) {
        ComplianceRule rule = complianceService.createRule(request);
        return new ResponseEntity<>(rule, HttpStatus.CREATED);
    }

    @GetMapping("/rules")
    public ResponseEntity<List<ComplianceRule>> getAllRules() {
        List<ComplianceRule> rules = complianceService.getAllRules();
        return ResponseEntity.ok(rules);
    }

    @GetMapping("/rules/active")
    public ResponseEntity<List<ComplianceRule>> getActiveRules() {
        List<ComplianceRule> rules = complianceService.getActiveRules();
        return ResponseEntity.ok(rules);
    }

    @GetMapping("/rules/{id}")
    public ResponseEntity<ComplianceRule> getRuleById(@PathVariable Long id) {
        ComplianceRule rule = complianceService.getRuleById(id);
        return ResponseEntity.ok(rule);
    }

    @GetMapping("/rules/category/{category}")
    public ResponseEntity<List<ComplianceRule>> getRulesByCategory(@PathVariable ComplianceRule.RuleCategory category) {
        List<ComplianceRule> rules = complianceService.getRulesByCategory(category);
        return ResponseEntity.ok(rules);
    }

    @PutMapping("/rules/{id}")
    public ResponseEntity<ComplianceRule> updateRule(@PathVariable Long id, 
                                                      @Valid @RequestBody ComplianceRuleRequest request) {
        ComplianceRule rule = complianceService.updateRule(id, request);
        return ResponseEntity.ok(rule);
    }

    @DeleteMapping("/rules/{id}")
    public ResponseEntity<Void> deleteRule(@PathVariable Long id) {
        complianceService.deleteRule(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== Compliance Checks ====================

    @PostMapping("/checks")
    public ResponseEntity<ComplianceCheck> createCheck(@Valid @RequestBody ComplianceCheckRequest request) {
        ComplianceCheck check = complianceService.createCheck(request);
        return new ResponseEntity<>(check, HttpStatus.CREATED);
    }

    @GetMapping("/checks")
    public ResponseEntity<List<ComplianceCheck>> getAllChecks() {
        List<ComplianceCheck> checks = complianceService.getAllChecks();
        return ResponseEntity.ok(checks);
    }

    @GetMapping("/checks/{id}")
    public ResponseEntity<ComplianceCheck> getCheckById(@PathVariable Long id) {
        ComplianceCheck check = complianceService.getCheckById(id);
        return ResponseEntity.ok(check);
    }

    @GetMapping("/checks/user/{userId}")
    public ResponseEntity<List<ComplianceCheck>> getChecksByUserId(@PathVariable Long userId) {
        List<ComplianceCheck> checks = complianceService.getChecksByUserId(userId);
        return ResponseEntity.ok(checks);
    }

    @GetMapping("/checks/status/{status}")
    public ResponseEntity<List<ComplianceCheck>> getChecksByStatus(@PathVariable ComplianceCheck.CheckStatus status) {
        List<ComplianceCheck> checks = complianceService.getChecksByStatus(status);
        return ResponseEntity.ok(checks);
    }

    @GetMapping("/checks/entity/{entityType}/{entityId}")
    public ResponseEntity<List<ComplianceCheck>> getChecksByEntity(@PathVariable String entityType, 
                                                                     @PathVariable Long entityId) {
        List<ComplianceCheck> checks = complianceService.getChecksByEntity(entityType, entityId);
        return ResponseEntity.ok(checks);
    }

    @PatchMapping("/checks/{id}/status/{status}")
    public ResponseEntity<ComplianceCheck> updateCheckStatus(@PathVariable Long id, 
                                                              @PathVariable ComplianceCheck.CheckStatus status) {
        ComplianceCheck check = complianceService.updateCheckStatus(id, status);
        return ResponseEntity.ok(check);
    }

    @PostMapping("/checks/{id}/resolve")
    public ResponseEntity<ComplianceCheck> resolveCheck(@PathVariable Long id, 
                                                         @Valid @RequestBody ResolveCheckRequest request) {
        ComplianceCheck check = complianceService.resolveCheck(id, request);
        return ResponseEntity.ok(check);
    }

    // ==================== Compliance Reports ====================

    @PostMapping("/reports")
    public ResponseEntity<ComplianceReport> createReport(@Valid @RequestBody ComplianceReportRequest request) {
        ComplianceReport report = complianceService.createReport(request);
        return new ResponseEntity<>(report, HttpStatus.CREATED);
    }

    @GetMapping("/reports")
    public ResponseEntity<List<ComplianceReport>> getAllReports() {
        List<ComplianceReport> reports = complianceService.getAllReports();
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/reports/{id}")
    public ResponseEntity<ComplianceReport> getReportById(@PathVariable Long id) {
        ComplianceReport report = complianceService.getReportById(id);
        return ResponseEntity.ok(report);
    }

    @PatchMapping("/reports/{id}/status/{status}")
    public ResponseEntity<ComplianceReport> updateReportStatus(@PathVariable Long id, 
                                                                @PathVariable ComplianceReport.ReportStatus status) {
        ComplianceReport report = complianceService.updateReportStatus(id, status);
        return ResponseEntity.ok(report);
    }

    // ==================== Statistics ====================

    @GetMapping("/statistics")
    public ResponseEntity<ComplianceStatistics> getStatistics() {
        ComplianceStatistics stats = complianceService.getStatistics();
        return ResponseEntity.ok(stats);
    }

    // ==================== Audit Trail ====================

    @GetMapping("/audit/user/{userId}")
    public ResponseEntity<List<AuditTrail>> getAuditTrailByUserId(@PathVariable Long userId) {
        List<AuditTrail> audits = complianceService.getAuditTrailByUserId(userId);
        return ResponseEntity.ok(audits);
    }

    @GetMapping("/audit/entity/{entityType}/{entityId}")
    public ResponseEntity<List<AuditTrail>> getAuditTrailByEntity(@PathVariable String entityType, 
                                                                   @PathVariable Long entityId) {
        List<AuditTrail> audits = complianceService.getAuditTrailByEntity(entityType, entityId);
        return ResponseEntity.ok(audits);
    }
}
