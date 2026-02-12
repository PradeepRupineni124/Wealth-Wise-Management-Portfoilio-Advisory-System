import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

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
import { RiskAdjustedMetricsComponent } from '../risk-analysis/risk-adjusted-metrics/risk-adjusted-metrics';
import { RiskAssessmentComponent } from '../risk-analysis/risk-assesment/risk-assesment';
import { ValueAtRiskComponent } from '../risk-analysis/value-at-risk.component/value-at-risk.component';

// --- Service ---
import { AllocationService, KeyMetric } from '../../../services/allocation.service'; 

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    PopoverModule,   
    DatePickerModule, 
    
   
    StatCardComponent,
    Graph1Component,
    Graph2Component,
    TabFilterComponent,
    SectorAllocationComponent,
    AllocationBreakdownComponent,
    GeographicDiversificationComponent,
    ReportsComponent,
    RiskAdjustedMetricsComponent,
    RiskAssessmentComponent,
    ValueAtRiskComponent
  ],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  
  private allocationService = inject(AllocationService);

  analyticsTabs: string[] = ['Performance', 'Asset Allocation', 'Risk Analysis', 'Reports'];
  currentTab: string = 'Performance';

  stats: KeyMetric[] = [];
  dateRange: Date[] | undefined;

  ngOnInit() {
    this.allocationService.getKeyMetrics().subscribe((data) => {
      this.stats = data;
    });
  }

  onTabChange(tab: string) {
    this.currentTab = tab;
  }

  exportReport() {
    if (!this.stats || this.stats.length === 0) {
      console.warn('No data to export');
      return;
    }

    const headers = ['Metric Title', 'Value', 'Context', 'Status'];
    const rows = this.stats.map(stat => [
      `"${stat.title}"`,
      `"${stat.value}"`,
      `"${stat.subtext}"`,
      stat.isPositive ? 'Positive' : 'Negative'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Wealth_Analytics_Report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}