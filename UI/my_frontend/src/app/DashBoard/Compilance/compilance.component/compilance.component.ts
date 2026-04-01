import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, forkJoin, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

// PDF Imports
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Custom Components & Services
import { StatCardComponent } from '../stat-card-v/stat-card-v.component';
import { ClientState } from '../../../services/client-state';
import { ComplianceService, ComplianceAuditLog } from '../../../services/compliance.service';
import { ComplianceDetailModalComponent } from '../../../models/compliance-detail-modal.component';

@Component({
  selector: 'app-compilance',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    ButtonModule,
    SkeletonModule,
    ToastModule,
    StatCardComponent
  ],
  templateUrl: './compilance.component.html',
  styleUrls: ['./compilance.component.css'],
  providers: [MessageService, DialogService]
})
export class ComplianceComponent implements OnInit, OnDestroy {

  currentClientName: string = 'Client';
  currentClientId: number | null = null;
  loading: boolean = true;

  // Dashboard Stats (Defaults to 0 for the Empty State)
  stats = {
    score: 0,
    compliant: 0,
    actionRequired: 0,
    reports: 0,
    scoreColor: 'blue' as 'green' | 'orange' | 'blue' | 'red',
    scoreTextColor: '#3b82f6'
  };

  riskLimits: any[] = [];
  auditLogs: ComplianceAuditLog[] = [];

  // Detailed Regulatory Content for PDFs
  private regulatoryContent: any = {
    'sec-rules': {
      title: 'SEC Amends Adviser Rules',
      date: 'Jan 4, 2026',
      content: `EXECUTIVE SUMMARY:\nThe Securities and Exchange Commission (SEC) has officially adopted sweeping new amendments to the Investment Advisers Act of 1940. These changes represent the most significant regulatory overhaul for registered investment advisers (RIAs) in the past decade, focusing heavily on enhanced custody rule requirements, new safeguarding standards for crypto assets, and mandatory quarterly reporting.\n\n1. ENHANCED CUSTODY AND SAFEGUARDING RULE:\nThe traditional "Custody Rule" has been expanded and rebranded as the "Safeguarding Rule." It now mandates that RIAs maintain client assets with a qualified custodian, extending beyond traditional funds and securities to include all assets.\n\n2. QUARTERLY STATEMENT RULE:\nRegistered private fund advisers are now required to distribute a quarterly statement to private fund investors detailing information regarding fund fees, expenses, and performance.\n\n3. MANDATORY COMPLIANCE REVIEWS:\nFirms must now document their annual compliance rule reviews entirely in writing. Verbal reviews or summarized high-level notes are no longer sufficient.\n\nACTION ITEMS FOR WEALTH MANAGERS:\n- Conduct an immediate inventory of all client assets.\n- Restructure fee billing and performance reporting systems.\n- Update the Form ADV Part 2A (Brochure) to reflect these new structural changes.`
    },
    'aml-rules': {
      title: 'Updated AML & CDD Requirements',
      date: 'Dec 28, 2025',
      content: `EXECUTIVE SUMMARY:\nThe Financial Crimes Enforcement Network (FinCEN) has issued highly anticipated updates to the Customer Due Diligence (CDD) rule and Anti-Money Laundering (AML) requirements. These updates align financial institution mandates with the Corporate Transparency Act (CTA).\n\n1. BENEFICIAL OWNERSHIP INFORMATION (BOI):\nFinancial institutions are now required to collect, verify, and monitor Beneficial Ownership Information (BOI) for all legal entity customers at the time of account opening. The threshold drops the ownership stake definition from 25% down to 10% for high-risk jurisdictions.\n\n2. ELIMINATION OF THRESHOLD EXCEPTIONS:\nPreviously, certain pooled investment vehicles and holding companies were exempt. As of this ruling, all exceptions have been revoked.\n\n3. CONTINUOUS MONITORING IMPERATIVE:\nThe ruling shifts AML compliance from a "point-in-time" onboarding task to a continuous monitoring requirement.\n\nACTION ITEMS FOR WEALTH MANAGERS:\n- Upgrade KYC/AML software to integrate directly with the FinCEN BOI registry.\n- Initiate a historical remediation project for all existing legal entity accounts.\n- Revise the firm's Risk Assessment matrix.`
    }
  };

  private clientSubscription!: Subscription;

  constructor(
    private clientState: ClientState,
    private complianceService: ComplianceService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.clientSubscription = this.clientState.currentClient$.subscribe(client => {
      if (client && (client.clientId)) {

        // FIX: Strictly use the Client ID. Do NOT use portfolioId here.
        // The backend Compliance Service will fetch the portfolio ID on its own.
        const targetId = client.clientId || client.id;

        this.currentClientId = targetId;
        this.currentClientName = client.fullName;

        this.initializeComplianceDashboard(targetId);
      } else {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  initializeComplianceDashboard(targetId: number) {
    this.loading = true;
    this.cdr.detectChanges();

    // 1. Run Manual Audit with auto-retry
    this.complianceService.runManualAudit(targetId).pipe(
      retry({ count: 2, delay: 1000 }), // Retry if backend is still saving the investment
      catchError(err => {
        return of(null); // Proceed silently if audit fails (e.g., empty portfolio 400 error)
      })
    ).subscribe(() => {
      // 2. Fetch the data
      this.fetchDashboardData(targetId);
    });
  }

  private fetchDashboardData(targetId: number) {
    forkJoin({
      summary: this.complianceService.getComplianceSummary(targetId).pipe(
        catchError(err => {
          // If backend throws 400 Bad Request, intercept it and return 0s
          return of({ complianceScore: 0, activeChecks: 0, actionRequired: 0, reportsGenerated: 0, isEmptyFallback: true });
        })
      ),
      risk: this.complianceService.getRiskMetrics(targetId).pipe(
        catchError(err => {
          // Return safe 0s for the risk limits
          return of({ singleAssetExposure: 0, sectorConcentration: 0, leverageRatio: 0, liquidityCoverage: 0 });
        })
      ),
      logs: this.complianceService.getAuditLogs(targetId).pipe(
        catchError(err => {
          return of([]); // Return empty logs array
        })
      )
    }).subscribe({
      next: (results) => {
        const summaryData: any = results.summary;

        // Determine if we hit the "Empty Portfolio" state
        const isPortfolioEmpty = summaryData.isEmptyFallback || (summaryData.complianceScore === 0 && summaryData.activeChecks === 0);

        if (isPortfolioEmpty) {
          // Display the friendly UX message
          this.messageService.add({
            severity: 'info',
            summary: 'No Investments Found',
            detail: 'Please add investments in the Portfolio to view compliance metrics.',
            life: 5000
          });
        }

        // Map Stats safely (Defaults to 0)
        this.stats = {
          score: summaryData.complianceScore || 0,
          compliant: summaryData.activeChecks || 0,
          actionRequired: summaryData.actionRequired || 0,
          reports: summaryData.reportsGenerated || 0,
          scoreColor: this.calculateScoreColor(summaryData.complianceScore || 0),
          scoreTextColor: this.getHexColor(summaryData.complianceScore || 0)
        };

        // Map Tables
        this.riskLimits = this.mapRiskMetrics(results.risk);
        this.auditLogs = results.logs;

        setTimeout(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }, 500);
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
        this.messageService.add({ severity: 'error', summary: 'System Error', detail: 'Could not connect to compliance service.' });
      }
    });
  }

  // ==========================================
  // HELPERS & UI LOGIC
  // ==========================================

  private mapRiskMetrics(metrics: any): any[] {
    return [
      {
        label: 'Single Asset Exposure',
        val: metrics.singleAssetExposure || 0,
        display: `${metrics.singleAssetExposure || 0}% / 10%`,
        status: (metrics.singleAssetExposure || 0) > 8 ? 'Near Limit' : 'Safe',
        color: (metrics.singleAssetExposure || 0) > 8 ? '#f59e0b' : '#10b981'
      },
      {
        label: 'Sector Concentration',
        val: metrics.sectorConcentration || 0,
        display: `${metrics.sectorConcentration || 0}% / 25%`,
        status: (metrics.sectorConcentration || 0) > 20 ? 'Near Limit' : 'Safe',
        color: (metrics.sectorConcentration || 0) > 20 ? '#f59e0b' : '#10b981'
      },
      {
        label: 'Leverage Ratio',
        val: ((metrics.leverageRatio || 0) / 2) * 100,
        display: `${metrics.leverageRatio || 0}x / 2x`,
        status: (metrics.leverageRatio || 0) > 1.5 ? 'Critical' : 'Safe',
        color: (metrics.leverageRatio || 0) > 1.5 ? '#ef4444' : '#10b981'
      },
      {
        label: 'Liquidity Coverage (Cash)',
        val: metrics.liquidityCoverage || 0,
        display: `${metrics.liquidityCoverage || 0}% / 5%`,
        status: (metrics.liquidityCoverage || 0) < 5 ? 'Critical' : 'Safe',
        color: (metrics.liquidityCoverage || 0) < 5 ? '#ef4444' : '#10b981'
      }
    ];
  }

  calculateScoreColor(score: number): 'green' | 'orange' | 'blue' | 'red' {
    if (score === 0) return 'blue'; // Empty portfolio shows neutral blue
    return score >= 80 ? 'green' : score >= 60 ? 'orange' : 'red';
  }

  getHexColor(score: number): string {
    if (score === 0) return '#3b82f6';
    return score >= 80 ? '#16a34a' : score >= 60 ? '#d97706' : '#dc2626';
  }

  getSeverity(status: boolean) {
    return status ? 'success' : 'warn';
  }

  // ==========================================
  // PDF EXPORTS
  // ==========================================

  exportRiskReport() {
    const doc = new jsPDF();
    doc.setFontSize(18); doc.setTextColor(15, 23, 42); doc.text('Risk Exposure Report', 14, 22);
    doc.setFontSize(11); doc.setTextColor(100, 116, 139); doc.text(`Client: ${this.currentClientName}`, 14, 30); doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 14, 36);
    const headers = [['Risk Factor', 'Current vs Limit', 'Status']];
    const data = this.riskLimits.map(item => [item.label, item.display, item.status]);
    autoTable(doc, { startY: 45, head: headers, body: data, theme: 'grid', headStyles: { fillColor: [15, 23, 42], textColor: 255 }, alternateRowStyles: { fillColor: [248, 250, 252] }, styles: { fontSize: 10, cellPadding: 5 } });
    doc.save(`Risk_Report_${this.currentClientName}.pdf`);
    this.incrementReportCount();
  }

  generateReport() {
    const doc = new jsPDF('landscape');
    doc.setFontSize(18); doc.setTextColor(15, 23, 42); doc.text('Compliance Audit Log', 14, 22);
    doc.setFontSize(11); doc.setTextColor(100, 116, 139); doc.text(`Client: ${this.currentClientName}`, 14, 30); doc.text(`Overall Compliance Score: ${this.stats.score}%`, 14, 36); doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 14, 42);
    const headers = [['Review Type', 'Regulation', 'Status', 'Findings', 'Review Date', 'Next Review']];
    const data = this.auditLogs.map(log => [log.reviewType, log.regulation, log.status ? 'Compliant' : 'Action Required', log.findings, log.reviewDate, log.nextReview]);
    autoTable(doc, { startY: 50, head: headers, body: data, theme: 'striped', headStyles: { fillColor: [16, 185, 129], textColor: 255 }, styles: { fontSize: 9, cellPadding: 4, overflow: 'linebreak' }, columnStyles: { 3: { cellWidth: 90 } } });
    doc.save(`Compliance_Audit_${this.currentClientName}.pdf`);
    this.incrementReportCount();
  }

  generateRegulationPdf(ruleId: string) {
    const rule = this.regulatoryContent[ruleId];
    if (!rule) return;
    const doc = new jsPDF();
    doc.setFontSize(16); doc.setTextColor(15, 23, 42); doc.text('Regulatory Intelligence Update', 14, 20);
    doc.setFontSize(14); doc.setTextColor(37, 99, 235); doc.text(rule.title, 14, 32);
    doc.setFontSize(10); doc.setTextColor(100, 116, 139); doc.text(`Posted Date: ${rule.date}`, 14, 38); doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 43);
    doc.setDrawColor(226, 232, 240); doc.line(14, 48, 196, 48);
    doc.setFontSize(10); doc.setTextColor(51, 65, 85);
    const splitText = doc.splitTextToSize(rule.content, 180);
    let yPos = 58;
    for (let i = 0; i < splitText.length; i++) {
      if (yPos > 275) { doc.addPage(); yPos = 20; }
      doc.text(splitText[i], 14, yPos);
      yPos += 6;
    }

    const totalPages = doc.getNumberOfPages();
    doc.setFontSize(8); doc.setTextColor(148, 163, 184);
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.text(`WealthWise Compliance Module - Internal Use Only | Page ${i} of ${totalPages}`, 14, 290);
    }

    doc.save(`${rule.title.replace(/\s+/g, '_')}.pdf`);
  }

  private incrementReportCount() {
    this.stats.reports = this.stats.reports + 1;
    this.messageService.add({ severity: 'success', summary: 'Report Generated', detail: 'PDF downloaded and count updated.' });
  }

  scheduleReview() {
    const nextWeek = new Date(); nextWeek.setDate(nextWeek.getDate() + 7);
    const title = `Compliance Review: ${this.currentClientName}`;
    window.open(`https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}`, '_blank');
  }

  showLogDetails(log: ComplianceAuditLog) {
    this.dialogService.open(ComplianceDetailModalComponent, { header: `${log.reviewType} - Audit Findings`, width: '60%', data: { auditLog: log } });
  }

  ngOnDestroy() {
    if (this.clientSubscription) this.clientSubscription.unsubscribe();
  }
}