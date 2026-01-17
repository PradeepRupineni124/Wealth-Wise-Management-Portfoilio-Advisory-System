import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { StatCardComponent } from '../stat-card-v/stat-card-v.component';
import { ClientState } from '../../../client-state';

@Component({
  selector: 'app-compilance',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, ButtonModule, StatCardComponent],
  templateUrl: './compilance.component.html',
  styleUrls: ['./compilance.component.css']
})
export class ComplianceComponent implements OnInit, OnDestroy {

  currentClientName: string = 'Client';

  stats = {
    score: 0,
    compliant: 0,
    actionRequired: 0,
    reports: 0,
    scoreColor: 'green' as 'green' | 'orange' | 'blue' | 'red',
    scoreTextColor: '#0f172a'
  };

  riskLimits: any[] = [];
  auditLogs: any[] = [];
  private clientSubscription!: Subscription;

  // --- FULL DATA STORE FOR ALL 6 USERS ---
  allData: any = {
    // 1. PRADEEP (High Score -> Green)
    1: {
      stats: { score: 92, compliant: 4, actionRequired: 1, reports: 28 },
      riskLimits: [
        { label: 'Single Asset Exposure', val: 85, display: '8.5% / 10%', status: 'Near Limit', color: '#f59e0b' },
        { label: 'Sector Concentration', val: 88, display: '22% / 25%', status: 'Near Limit', color: '#f59e0b' },
        { label: 'Leverage Ratio', val: 60, display: '1.2x / 2x', status: 'Safe', color: '#10b981' },
        { label: 'Liquidity Coverage', val: 100, display: '125% / 100%', status: 'Safe', color: '#ef4444', extra: 'Over Limit' }
      ],
      auditLogs: [
        { type: 'Portfolio Review', reg: 'SEC Rule 15c3-3', status: 'Compliant', findings: 'All client assets properly segregated', date: '2026-01-05', next: '2026-04-05' },
        { type: 'Risk Assessment', reg: 'Basel III', status: 'Compliant', findings: 'Risk-weighted assets within regulatory limits', date: '2026-01-03', next: '2026-02-03' },
        { type: 'KYC Verification', reg: 'AML/CTF', status: 'Action Required', findings: 'Annual client verification due in 7 days', date: '2025-12-28', next: '2026-01-13' },
        { type: 'Investment Limits', reg: 'FINRA Rule 2111', status: 'Compliant', findings: 'All investments aligned with client suitability', date: '2025-12-20', next: '2026-03-20' },
        { type: 'Disclosure Requirements', reg: 'Form ADV Part 2', status: 'Compliant', findings: 'All material changes properly disclosed', date: '2025-12-15', next: '2026-12-15' }
      ]
    },

    // 2. VENU (Perfect Score -> Green)
    2: {
      stats: { score: 100, compliant: 5, actionRequired: 0, reports: 12 },
      riskLimits: [
        { label: 'Single Asset Exposure', val: 40, display: '4% / 10%', status: 'Safe', color: '#10b981' },
        { label: 'Sector Concentration', val: 50, display: '12% / 25%', status: 'Safe', color: '#10b981' },
        { label: 'Leverage Ratio', val: 20, display: '0.4x / 2x', status: 'Safe', color: '#10b981' },
        { label: 'Liquidity Coverage', val: 95, display: '110% / 100%', status: 'Safe', color: '#10b981' }
      ],
      auditLogs: [
        { type: 'Risk Assessment', reg: 'Basel III', status: 'Compliant', findings: 'No issues found', date: '2026-01-10', next: '2026-02-10' },
        { type: 'Tax Compliance', reg: 'IRS 1099', status: 'Compliant', findings: 'Tax forms generated', date: '2026-01-01', next: '2027-01-01' },
        { type: 'Portfolio Review', reg: 'SEC Rule 15c3-3', status: 'Compliant', findings: 'Portfolio balanced perfectly', date: '2025-12-25', next: '2026-03-25' },
        { type: 'GDPR Data Check', reg: 'GDPR Art 30', status: 'Compliant', findings: 'Data processing records updated', date: '2025-12-18', next: '2026-12-18' },
        { type: 'Investment Limits', reg: 'FINRA Rule 2111', status: 'Compliant', findings: 'Investments within agreed limits', date: '2025-12-10', next: '2026-03-10' }
      ]
    },

    // 3. NITHIN (Critical Risk -> Red)
    3: {
      stats: { score: 65, compliant: 2, actionRequired: 3, reports: 45 },
      riskLimits: [
        { label: 'Single Asset Exposure', val: 95, display: '9.5% / 10%', status: 'Critical', color: '#ef4444' },
        { label: 'Sector Concentration', val: 92, display: '24% / 25%', status: 'Critical', color: '#ef4444' },
        { label: 'Leverage Ratio', val: 50, display: '1.0x / 2x', status: 'Safe', color: '#10b981' },
        { label: 'Liquidity Coverage', val: 40, display: '80% / 100%', status: 'Critical', color: '#ef4444' }
      ],
      auditLogs: [
        { type: 'AML Alert', reg: 'AML/CTF', status: 'Non-Compliant', findings: 'Suspicious transaction flagged', date: '2026-01-14', next: 'Immediate' },
        { type: 'Portfolio Review', reg: 'SEC Rule 15c3-3', status: 'Action Required', findings: 'Rebalancing needed immediately', date: '2026-01-12', next: '2026-01-19' },
        { type: 'Margin Call Check', reg: 'Reg T', status: 'Action Required', findings: 'Maintenance margin below 25%', date: '2026-01-10', next: '2026-01-11' },
        { type: 'KYC Verification', reg: 'AML/CTF', status: 'Compliant', findings: 'Documents verified', date: '2026-01-05', next: '2027-01-05' },
        { type: 'Investment Limits', reg: 'FINRA Rule 2111', status: 'Non-Compliant', findings: 'High-risk asset allocation exceeded', date: '2026-01-02', next: 'Immediate' }
      ]
    },

    // 4. HARSHIT (Good Score -> Green)
    4: {
      stats: { score: 88, compliant: 5, actionRequired: 0, reports: 18 },
      riskLimits: [
        { label: 'Single Asset Exposure', val: 55, display: '5.5% / 10%', status: 'Safe', color: '#10b981' },
        { label: 'Sector Concentration', val: 60, display: '15% / 25%', status: 'Safe', color: '#10b981' },
        { label: 'Leverage Ratio', val: 30, display: '0.6x / 2x', status: 'Safe', color: '#10b981' },
        { label: 'Liquidity Coverage', val: 90, display: '105% / 100%', status: 'Safe', color: '#10b981' }
      ],
      auditLogs: [
        { type: 'Quarterly Audit', reg: 'Internal', status: 'Compliant', findings: 'Routine check passed', date: '2026-01-08', next: '2026-04-08' },
        { type: 'Investment Limits', reg: 'FINRA Rule 2111', status: 'Compliant', findings: 'All limits respected', date: '2026-01-02', next: '2026-04-02' },
        { type: 'Data Privacy', reg: 'CCPA', status: 'Compliant', findings: 'Privacy notices updated', date: '2025-12-30', next: '2026-12-30' },
        { type: 'KYC Verification', reg: 'AML/CTF', status: 'Compliant', findings: 'ID Documents Valid', date: '2025-12-20', next: '2026-12-20' },
        { type: 'Fee Disclosure', reg: 'Form ADV', status: 'Compliant', findings: 'Fees disclosed to client', date: '2025-12-15', next: '2026-12-15' }
      ]
    },

    // 5. KIRAN (Medium Score -> Orange)
    5: {
      stats: { score: 78, compliant: 3, actionRequired: 2, reports: 30 },
      riskLimits: [
        { label: 'Single Asset Exposure', val: 80, display: '8% / 10%', status: 'Near Limit', color: '#f59e0b' },
        { label: 'Sector Concentration', val: 85, display: '21% / 25%', status: 'Near Limit', color: '#f59e0b' },
        { label: 'Leverage Ratio', val: 40, display: '0.8x / 2x', status: 'Safe', color: '#10b981' },
        { label: 'Liquidity Coverage', val: 100, display: '100% / 100%', status: 'Safe', color: '#10b981' }
      ],
      auditLogs: [
        { type: 'Portfolio Review', reg: 'SEC Rule 15c3-3', status: 'Action Required', findings: 'Minor rebalancing suggested', date: '2026-01-11', next: '2026-01-18' },
        { type: 'KYC Verification', reg: 'AML/CTF', status: 'Action Required', findings: 'Address proof outdated', date: '2026-01-05', next: '2026-02-05' },
        { type: 'Risk Assessment', reg: 'Basel III', status: 'Compliant', findings: 'Within acceptable limits', date: '2025-12-29', next: '2026-03-29' },
        { type: 'Tax Filing', reg: 'IRS', status: 'Compliant', findings: 'Filing preparation complete', date: '2025-12-20', next: '2026-04-15' },
        { type: 'Ethical Standards', reg: 'Internal', status: 'Compliant', findings: 'No conflicts of interest', date: '2025-12-10', next: '2026-12-10' }
      ]
    },

    // 6. GANESH (Critical Score -> Red)
    6: {
      stats: { score: 55, compliant: 1, actionRequired: 4, reports: 50 },
      riskLimits: [
        { label: 'Single Asset Exposure', val: 98, display: '9.8% / 10%', status: 'Critical', color: '#ef4444' },
        { label: 'Sector Concentration', val: 95, display: '23.8% / 25%', status: 'Critical', color: '#ef4444' },
        { label: 'Leverage Ratio', val: 90, display: '1.8x / 2x', status: 'Critical', color: '#ef4444' },
        { label: 'Liquidity Coverage', val: 20, display: '50% / 100%', status: 'Critical', color: '#ef4444' }
      ],
      auditLogs: [
        { type: 'Margin Call', reg: 'Reg T', status: 'Non-Compliant', findings: 'Margin deficit detected', date: '2026-01-15', next: 'Immediate' },
        { type: 'AML Flag', reg: 'AML/CTF', status: 'Non-Compliant', findings: 'High volume cash transfer', date: '2026-01-14', next: 'Immediate' },
        { type: 'Suitability Check', reg: 'FINRA Rule 2111', status: 'Action Required', findings: 'Profile mismatch', date: '2026-01-10', next: '2026-01-17' },
        { type: 'Portfolio Review', reg: 'SEC Rule 15c3-3', status: 'Action Required', findings: 'Concentration risk high', date: '2026-01-08', next: '2026-01-15' },
        { type: 'Disclosure Check', reg: 'Form CRS', status: 'Compliant', findings: 'Form delivered', date: '2026-01-01', next: '2027-01-01' }
      ]
    }
  };

  constructor(private clientState: ClientState) { }

  ngOnInit() {
    this.clientSubscription = this.clientState.currentClient$.subscribe(client => {
      if (client) {
        this.currentClientName = client.name;
        this.loadClientData(client.id);
      }
    });
  }

  loadClientData(id: number) {
    const data = this.allData[id] || this.allData[1];

    // Copy base stats
    this.stats = { ...data.stats };

    // 1. Calculate Icon Background (Class Name)
    this.stats.scoreColor = this.calculateScoreColor(this.stats.score);

    // 2. Calculate Text Color (Hex Code)
    this.stats.scoreTextColor = this.getHexColor(this.stats.score);

    this.riskLimits = data.riskLimits || this.allData[1].riskLimits;
    this.auditLogs = data.auditLogs || this.allData[1].auditLogs;
  }

  // Returns 'green' | 'orange' | 'red' for the icon class
  calculateScoreColor(score: number): 'green' | 'orange' | 'blue' | 'red' {
    if (score >= 80) return 'green';
    if (score >= 60) return 'orange';
    return 'red';
  }

  // Returns Hex Code for the text value
  getHexColor(score: number): string {
    if (score >= 80) return '#16a34a'; // Green
    if (score >= 60) return '#d97706'; // Orange
    return '#dc2626'; // Red
  }

  getSeverity(status: string) {
    if (status === 'Compliant') return 'success';
    if (status === 'Action Required') return 'warn';
    if (status === 'Non-Compliant') return 'danger';
    return 'info';
  }

  // --- FUNCTIONALITIES ---

  // 1. Audit Report (CSV)
  generateReport() {
    const headers = ['Review Type', 'Regulation', 'Status', 'Findings', 'Review Date', 'Next Review'];
    const rows = this.auditLogs.map(log => [
      log.type, log.reg, log.status, `"${log.findings}"`, log.date, log.next
    ]);
    this.downloadCSV(headers, rows, `Compliance_Report_${this.currentClientName}.csv`);
  }

  // 2. Risk Report (CSV)
  exportRiskReport() {
    const headers = ['Risk Type', 'Current Value (%)', 'Limit / Target', 'Status', 'Extra Note'];
    const rows = this.riskLimits.map(item => [
      item.label, item.val, item.display, item.status, item.extra || ''
    ]);
    this.downloadCSV(headers, rows, `Risk_Exposure_Report_${this.currentClientName}.csv`);
  }

  // 3. Schedule Calendar
  scheduleReview() {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const startDate = nextWeek.toISOString().replace(/-|:|\.\d\d\d/g, "").slice(0, 15) + 'Z';
    const endDate = new Date(nextWeek.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "").slice(0, 15) + 'Z';

    const title = `Compliance Review: ${this.currentClientName}`;
    const details = `Quarterly compliance check and risk limit review for ${this.currentClientName}. Discuss pending items.`;
    const location = 'Online / Office';

    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    window.open(url, '_blank');
  }

  // CSV Helper
  private downloadCSV(headers: string[], rows: any[], filename: string) {
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.replace(' ', '_');
    a.click();
    window.URL.revokeObjectURL(url);
  }

  ngOnDestroy() {
    if (this.clientSubscription) {
      this.clientSubscription.unsubscribe();
    }
  }
}