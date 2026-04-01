import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { TimelineModule } from 'primeng/timeline';
import { ComplianceAuditLog } from '../services/compliance.service';

@Component({
  selector: 'app-compliance-detail-modal',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TagModule,
    DividerModule,
    TimelineModule
  ],
  template: `
    <div class="compliance-modal-wrapper">
      <div class="modal-header">
        <div class="title-area">
          <span class="text-xs uppercase tracking-wider text-slate-500 font-bold">Audit Detail</span>
          <h2 class="text-2xl font-extrabold text-slate-800 m-0">{{ auditLog?.reviewType }}</h2>
          <div class="flex align-items-center gap-2 mt-1">
            <i class="pi pi-book text-slate-400"></i>
            <span class="text-sm font-medium text-slate-600">{{ auditLog?.regulation }}</span>
          </div>
        </div>
        <p-tag 
          [value]="auditLog?.status ? 'COMPLIANT' : 'ACTION REQUIRED'"
          [severity]="getSeverity()"
          class="status-tag">
        </p-tag>
      </div>

      <p-divider></p-divider>

      <div class="detail-grid">
        <div class="main-content">
          
          <section class="mb-4 animate-in">
            <h3 class="section-title"><i class="pi pi-compass mr-2"></i>Review Overview</h3>
            <div class="overview-container">
              <p class="m-0 leading-relaxed text-slate-700">
                {{ getReviewDescription(auditLog?.reviewType) }}
              </p>
            </div>
          </section>

          <section class="mb-4 animate-in" style="animation-delay: 0.1s; animation-fill-mode: both;">
            <h3 class="section-title"><i class="pi pi-info-circle mr-2"></i>Audit Findings</h3>
            <div class="findings-container" [ngClass]="{'border-warn': !auditLog?.status, 'border-success': auditLog?.status}">
              <p class="m-0 leading-relaxed">{{ auditLog?.findings }}</p>
            </div>
          </section>

          <section *ngIf="!auditLog?.status" class="resolution-path animate-in" style="animation-delay: 0.2s; animation-fill-mode: both;">
             <h3 class="section-title text-amber-700"><i class="pi pi-wrench mr-2"></i>Required Resolution</h3>
             <ul class="step-list">
               <li>{{ getResolutionPath(auditLog?.reviewType) }}</li>
               <li>Run a new Compliance Audit to verify the changes.</li>
             </ul>
          </section>
        </div>

        <div class="sidebar">
          <div class="date-card">
            <div class="date-row">
              <span class="date-label">Last Review</span>
              <span class="date-value">{{ auditLog?.reviewDate | date:'mediumDate' }}</span>
            </div>
            <p-divider></p-divider>
            <div class="date-row">
              <span class="date-label">Next Due</span>
              <span class="date-value text-blue-600">{{ auditLog?.nextReview | date:'mediumDate' }}</span>
            </div>
          </div>

          <div class="context-box mt-4">
            <h4 class="text-xs font-bold uppercase text-slate-500 mb-2">Policy Impact</h4>
            <p class="text-sm leading-normal text-slate-700">
                Failure to comply with <strong>{{ auditLog?.regulation }}</strong> may result in automated 
                restrictions on the <strong>WealthWise Portfolio Advisory System</strong>.
            </p>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <p-button label="Close" icon="pi pi-times" (click)="ref.close()"></p-button>
      </div>
    </div>
  `,
  styles: [`
    .compliance-modal-wrapper { padding: 1rem; color: #334155; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; }
    .status-tag ::ng-deep .p-tag { padding: 0.6rem 1.2rem; font-size: 0.85rem; letter-spacing: 0.05em; }
    
    .detail-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 2rem; margin-top: 1rem; }
    .section-title { font-size: 0.9rem; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 0.75rem; display: flex; align-items: center; }
    
    .overview-container { background: #f8fafc; border: 1px solid #e2e8f0; padding: 1rem 1.25rem; border-radius: 8px; font-size: 0.95rem; }
    
    .findings-container { padding: 1.25rem; border-radius: 8px; font-size: 1rem; border-left: 4px solid #cbd5e1; background: #f8fafc;}
    .border-warn { border-left-color: #f59e0b; background: #fffbeb; }
    .border-success { border-left-color: #10b981; background: #ecfdf5; }

    .step-list { padding-left: 1.25rem; margin: 0; font-size: 0.95rem; color: #92400e; }
    .step-list li { margin-bottom: 0.5rem; line-height: 1.4; }

    .date-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; }
    .date-row { display: flex; justify-content: space-between; align-items: center; }
    .date-label { font-size: 0.8rem; color: #64748b; font-weight: 500; }
    .date-value { font-weight: 700; font-size: 0.95rem; }

    .context-box { background: #eff6ff; border: 1px dashed #bfdbfe; padding: 1rem; border-radius: 8px; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 2rem; }

    .animate-in { animation: slideIn 0.3s ease-out; }
    @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class ComplianceDetailModalComponent implements OnInit {
  auditLog: ComplianceAuditLog | null = null;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit() {
    this.auditLog = this.config.data?.auditLog;
  }

  getSeverity(): 'success' | 'warn' | 'danger' | 'info' {
    if (this.auditLog?.status) return 'success';
    return 'warn';
  }

  /**
   * Provides the overview description for the specific review type
   * Based on the official compliance documentation.
   */
  getReviewDescription(type: string | undefined): string {
    switch (type) {
      case 'KYC Verification':
        return "This ensures the client is legally allowed to invest by confirming their identity and financial background are fully documented.";
      case 'Risk Assessment':
        return "This protects both the client and the advisor by ensuring the investments aren't riskier than the client's stated comfort level.";
      case 'Investment Limits':
        return "This prevents a client from putting all their eggs in one basket by capping how much of their total wealth can be tied up in one specific asset.";
      case 'Asset Allocation':
        return "This ensures a healthy mix between different asset categories (Equities, Bonds, Mutual Funds) to maintain broad diversification.";
      case 'Profile Audit':
        return "Every portfolio needs a target. This rule ensures the advisor has captured what the client is actually investing for (e.g., Retirement).";
      default:
        return "Standard regulatory compliance check and portfolio verification.";
    }
  }

  /**
   * Provides a dynamic resolution path based on which rule failed
   */
  getResolutionPath(type: string | undefined): string {
    switch (type) {
      case 'KYC Verification':
        return "Update the client's profile in the Client Management module by verifying their pending digital documents.";
      case 'Risk Assessment':
        return "Sell high-risk assets to lower the portfolio's weighted average risk, OR interview the client to officially increase their Risk Profile score.";
      case 'Investment Limits':
        return "Sell a portion of the overflowing asset to bring its allocation below the 40% maximum threshold.";
      case 'Asset Allocation':
        return "Rebalance the portfolio by purchasing assets in missing categories (e.g., if 100% Equities, purchase Bonds).";
      case 'Profile Audit':
        return "Update the client's profile in the Client Management module by defining their Primary Financial Goals.";
      default:
        return "Review the specific findings and update the portfolio or client profile accordingly.";
    }
  }
}