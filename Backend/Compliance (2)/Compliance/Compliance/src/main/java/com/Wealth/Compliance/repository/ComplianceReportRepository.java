package com.Wealth.Compliance.repository;

import com.Wealth.Compliance.model.ComplianceReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ComplianceReportRepository extends JpaRepository<ComplianceReport, Long> {
    
    Optional<ComplianceReport> findByReportNumber(String reportNumber);
    
    List<ComplianceReport> findByReportType(ComplianceReport.ReportType reportType);
    
    List<ComplianceReport> findByStatus(ComplianceReport.ReportStatus status);
    
    List<ComplianceReport> findByReportPeriodStartBetween(LocalDate start, LocalDate end);
    
    List<ComplianceReport> findByGeneratedBy(String generatedBy);
}
