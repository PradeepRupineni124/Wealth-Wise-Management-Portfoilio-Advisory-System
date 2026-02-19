package com.Wealth.Compliance.service;

import com.Wealth.Compliance.dto.*;
import com.Wealth.Compliance.exception.BadRequestException;
import com.Wealth.Compliance.exception.ResourceNotFoundException;
import com.Wealth.Compliance.model.*;
import com.Wealth.Compliance.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ComplianceService {

    private final ComplianceRuleRepository ruleRepository;
    private final ComplianceCheckRepository checkRepository;
    private final ComplianceReportRepository reportRepository;
    private final AuditTrailRepository auditRepository;

    // ==================== Compliance Rules ====================

    @Transactional
    public ComplianceRule createRule(ComplianceRuleRequest request) {
        if (ruleRepository.findByRuleCode(request.getRuleCode()).isPresent()) {
            throw new BadRequestException("Rule with code '" + request.getRuleCode() + "' already exists");
        }

        ComplianceRule rule = new ComplianceRule();
        rule.setRuleCode(request.getRuleCode());
        rule.setRuleName(request.getRuleName());
        rule.setDescription(request.getDescription());
        rule.setCategory(request.getCategory());
        rule.setSeverity(request.getSeverity());
        rule.setIsActive(request.getIsActive());
        rule.setRegulatoryReference(request.getRegulatoryReference());
        rule.setPenaltyDescription(request.getPenaltyDescription());

        return ruleRepository.save(rule);
    }

    @Transactional(readOnly = true)
    public List<ComplianceRule> getAllRules() {
        return ruleRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<ComplianceRule> getActiveRules() {
        return ruleRepository.findByIsActiveTrue();
    }

    @Transactional(readOnly = true)
    public ComplianceRule getRuleById(Long id) {
        return ruleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compliance rule not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<ComplianceRule> getRulesByCategory(ComplianceRule.RuleCategory category) {
        return ruleRepository.findByCategory(category);
    }

    @Transactional
    public ComplianceRule updateRule(Long id, ComplianceRuleRequest request) {
        ComplianceRule rule = getRuleById(id);

        if (!rule.getRuleCode().equals(request.getRuleCode()) &&
            ruleRepository.findByRuleCode(request.getRuleCode()).isPresent()) {
            throw new BadRequestException("Rule with code '" + request.getRuleCode() + "' already exists");
        }

        rule.setRuleCode(request.getRuleCode());
        rule.setRuleName(request.getRuleName());
        rule.setDescription(request.getDescription());
        rule.setCategory(request.getCategory());
        rule.setSeverity(request.getSeverity());
        rule.setIsActive(request.getIsActive());
        rule.setRegulatoryReference(request.getRegulatoryReference());
        rule.setPenaltyDescription(request.getPenaltyDescription());

        return ruleRepository.save(rule);
    }

    @Transactional
    public void deleteRule(Long id) {
        if (!ruleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Compliance rule not found with id: " + id);
        }
        ruleRepository.deleteById(id);
    }

    // ==================== Compliance Checks ====================

    @Transactional
    public ComplianceCheck createCheck(ComplianceCheckRequest request) {
        // Validate rule exists
        getRuleById(request.getRuleId());

        ComplianceCheck check = new ComplianceCheck();
        check.setUserId(request.getUserId());
        check.setRuleId(request.getRuleId());
        check.setEntityType(request.getEntityType());
        check.setEntityId(request.getEntityId());
        check.setStatus(request.getStatus());
        check.setCheckDetails(request.getCheckDetails());
        check.setViolationDetails(request.getViolationDetails());
        check.setRemedialAction(request.getRemedialAction());

        return checkRepository.save(check);
    }

    @Transactional(readOnly = true)
    public List<ComplianceCheck> getAllChecks() {
        return checkRepository.findAll();
    }

    @Transactional(readOnly = true)
    public ComplianceCheck getCheckById(Long id) {
        return checkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compliance check not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<ComplianceCheck> getChecksByUserId(Long userId) {
        return checkRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public List<ComplianceCheck> getChecksByStatus(ComplianceCheck.CheckStatus status) {
        return checkRepository.findByStatus(status);
    }

    @Transactional(readOnly = true)
    public List<ComplianceCheck> getChecksByEntity(String entityType, Long entityId) {
        return checkRepository.findByEntityTypeAndEntityId(entityType, entityId);
    }

    @Transactional
    public ComplianceCheck updateCheckStatus(Long id, ComplianceCheck.CheckStatus status) {
        ComplianceCheck check = getCheckById(id);
        check.setStatus(status);
        return checkRepository.save(check);
    }

    @Transactional
    public ComplianceCheck resolveCheck(Long id, ResolveCheckRequest request) {
        ComplianceCheck check = getCheckById(id);
        check.setStatus(ComplianceCheck.CheckStatus.RESOLVED);
        check.setResolvedBy(request.getResolvedBy());
        check.setResolvedDate(LocalDateTime.now());
        check.setResolutionNotes(request.getResolutionNotes());
        return checkRepository.save(check);
    }

    // ==================== Compliance Reports ====================

    @Transactional
    public ComplianceReport createReport(ComplianceReportRequest request) {
        String reportNumber = generateReportNumber();

        // Calculate statistics for the period
        LocalDateTime start = request.getReportPeriodStart().atStartOfDay();
        LocalDateTime end = request.getReportPeriodEnd().atTime(23, 59, 59);
        
        List<ComplianceCheck> checksInPeriod = checkRepository.findByCheckDateBetween(start, end);
        
        long totalChecks = checksInPeriod.size();
        long passedChecks = checksInPeriod.stream()
                .filter(c -> c.getStatus() == ComplianceCheck.CheckStatus.PASSED)
                .count();
        long failedChecks = checksInPeriod.stream()
                .filter(c -> c.getStatus() == ComplianceCheck.CheckStatus.FAILED)
                .count();
        long pendingChecks = checksInPeriod.stream()
                .filter(c -> c.getStatus() == ComplianceCheck.CheckStatus.PENDING)
                .count();

        double complianceScore = totalChecks > 0 ? (passedChecks * 100.0 / totalChecks) : 0.0;

        ComplianceReport report = new ComplianceReport();
        report.setReportNumber(reportNumber);
        report.setReportTitle(request.getReportTitle());
        report.setReportType(request.getReportType());
        report.setReportPeriodStart(request.getReportPeriodStart());
        report.setReportPeriodEnd(request.getReportPeriodEnd());
        report.setTotalChecks((int) totalChecks);
        report.setPassedChecks((int) passedChecks);
        report.setFailedChecks((int) failedChecks);
        report.setPendingChecks((int) pendingChecks);
        report.setComplianceScore(complianceScore);
        report.setStatus(ComplianceReport.ReportStatus.DRAFT);
        report.setSummary(request.getSummary());
        report.setRecommendations(request.getRecommendations());
        report.setGeneratedBy(request.getGeneratedBy());

        return reportRepository.save(report);
    }

    @Transactional(readOnly = true)
    public List<ComplianceReport> getAllReports() {
        return reportRepository.findAll();
    }

    @Transactional(readOnly = true)
    public ComplianceReport getReportById(Long id) {
        return reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compliance report not found with id: " + id));
    }

    @Transactional
    public ComplianceReport updateReportStatus(Long id, ComplianceReport.ReportStatus status) {
        ComplianceReport report = getReportById(id);
        report.setStatus(status);
        return reportRepository.save(report);
    }

    // ==================== Statistics ====================

    @Transactional(readOnly = true)
    public ComplianceStatistics getStatistics() {
        ComplianceStatistics stats = new ComplianceStatistics();
        
        stats.setTotalRules((long) ruleRepository.findAll().size());
        stats.setActiveRules((long) ruleRepository.findByIsActiveTrue().size());
        stats.setTotalChecks((long) checkRepository.findAll().size());
        stats.setPassedChecks(checkRepository.countByStatus(ComplianceCheck.CheckStatus.PASSED));
        stats.setFailedChecks(checkRepository.countByStatus(ComplianceCheck.CheckStatus.FAILED));
        stats.setPendingChecks(checkRepository.countByStatus(ComplianceCheck.CheckStatus.PENDING));
        stats.setUnderReviewChecks(checkRepository.countByStatus(ComplianceCheck.CheckStatus.UNDER_REVIEW));
        
        long totalChecks = stats.getTotalChecks();
        stats.setComplianceRate(totalChecks > 0 ? 
                (stats.getPassedChecks() * 100.0 / totalChecks) : 0.0);
        
        // Count violations by severity
        stats.setCriticalViolations((long) ruleRepository.findBySeverity(ComplianceRule.RuleSeverity.CRITICAL).size());
        stats.setHighViolations((long) ruleRepository.findBySeverity(ComplianceRule.RuleSeverity.HIGH).size());
        stats.setMediumViolations((long) ruleRepository.findBySeverity(ComplianceRule.RuleSeverity.MEDIUM).size());
        stats.setLowViolations((long) ruleRepository.findBySeverity(ComplianceRule.RuleSeverity.LOW).size());
        
        return stats;
    }

    // ==================== Audit Trail ====================

    @Transactional
    public AuditTrail createAuditLog(Long userId, String userName, String action, 
                                      String entityType, Long entityId, String description,
                                      String ipAddress, String userAgent) {
        AuditTrail audit = new AuditTrail();
        audit.setUserId(userId);
        audit.setUserName(userName);
        audit.setAction(action);
        audit.setEntityType(entityType);
        audit.setEntityId(entityId);
        audit.setDescription(description);
        audit.setIpAddress(ipAddress);
        audit.setUserAgent(userAgent);
        audit.setStatus(AuditTrail.ActionStatus.SUCCESS);
        
        return auditRepository.save(audit);
    }

    @Transactional(readOnly = true)
    public List<AuditTrail> getAuditTrailByUserId(Long userId) {
        return auditRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public List<AuditTrail> getAuditTrailByEntity(String entityType, Long entityId) {
        return auditRepository.findByEntityTypeAndEntityId(entityType, entityId);
    }

    // ==================== Helper Methods ====================

    private String generateReportNumber() {
        return "RPT-" + System.currentTimeMillis();
    }
}
