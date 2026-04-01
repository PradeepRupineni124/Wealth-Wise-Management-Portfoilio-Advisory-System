import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, of } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter, switchMap, catchError } from 'rxjs/operators';

import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { DatePickerModule } from 'primeng/datepicker';

import { StatCardComponent } from '../performance/stat-card/stat-card';
import { Graph1Component } from "../performance/graph1/graph1";
import { Graph2Component } from "../performance/graph2/graph2";
import { TabFilterComponent } from '../../../shareable-components/tab-filter.component/tab-filter.component';
import { SectorAllocationComponent } from '../Asset-allocation/sector-allocation/sector-allocation';
import { AllocationBreakdownComponent } from '../Asset-allocation/allocation-breakdown/allocation-breakdown';
import { GeographicDiversificationComponent } from '../Asset-allocation/geographic-diversification/geographic-diversification';
import { ReportsComponent } from '../reports/reports';

// Correctly imported paths!
import { RiskAdjustedMetricsComponent } from '../risk-analysis/risk-adjusted-metrics/risk-adjusted-metrics';
import { RiskAssessmentComponent } from '../risk-analysis/risk-assesment/risk-assesment';
import { ValueAtRiskComponent } from '../risk-analysis/value-at-risk.component/value-at-risk.component';

// --- Service ---
import { AllocationService, KeyMetric } from '../../../services/allocation.service';
import { PdfExport } from '../../../services/pdf-export';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, PopoverModule, DatePickerModule,
    StatCardComponent, Graph1Component, Graph2Component, TabFilterComponent,
    SectorAllocationComponent, AllocationBreakdownComponent, GeographicDiversificationComponent,
    ReportsComponent, RiskAdjustedMetricsComponent, RiskAssessmentComponent, ValueAtRiskComponent
  ],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit, OnDestroy {

  private allocationService = inject(AllocationService);
  private pdfService = inject(PdfExport);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  analyticsTabs: string[] = ['Performance', 'Asset Allocation', 'Risk Analysis', 'Reports'];
  currentTab: string = 'Performance';

  stats: KeyMetric[] = [];
  dateRange: Date[] | undefined;
  
  loading: boolean = true; // Added to handle the switchMap spinner
  private subs: Subscription = new Subscription();

  ngOnInit() {
    // 1. Fire initial data fetch from session memory
    const savedId = sessionStorage.getItem('activeClientId');
    if (savedId) {
      this.allocationService.refreshData(Number(savedId));
    }

    // 2. Reactively fetch data when switching to this tab
    this.subs.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: any) => {
        if (event.urlAfterRedirects.includes('/analytics')) {
          const id = sessionStorage.getItem('activeClientId');
          if (id) this.allocationService.refreshData(Number(id));
        }
      })
    );

    // 3. THE SWITCHMAP PIPELINE (Mirrors OverviewComponent)
    this.subs.add(
      this.allocationService.activeClient$.pipe(
        switchMap(clientId => {
          if (!clientId) return of(null);
          
          this.loading = true; // Show spinner while waiting for database
          this.cdr.detectChanges();

          return this.allocationService.fetchClientData(clientId).pipe(
            catchError(() => of(null))
          );
        })
      ).subscribe(data => {
        if (data) {
          this.allocationService.processData(data);
        }
        this.loading = false; // Hide spinner
        this.cdr.detectChanges();
      })
    );

    // 4. Listen to the processed metrics to update HTML
    this.subs.add(
      this.allocationService.getKeyMetrics().subscribe(data => {
        this.stats = data;
        this.cdr.detectChanges();
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onTabChange(tab: string) {
    this.currentTab = tab;
  }

  exportReport() {
    if (!this.stats || this.stats.length === 0) return;
    this.pdfService.downloadReport('comprehensive');
  }
}