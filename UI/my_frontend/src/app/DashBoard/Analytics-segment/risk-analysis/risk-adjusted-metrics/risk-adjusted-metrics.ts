import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllocationService,RiskMetric } from '../../../../services/allocation.service';

@Component({
  selector: 'app-risk-adjusted-metrics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './risk-adjusted-metrics.html',
  styleUrls: ['./risk-adjusted-metrics.css']
})
export class RiskAdjustedMetricsComponent implements OnInit {
  
  private allocationService = inject(AllocationService);
  metrics: RiskMetric[] = [];

  ngOnInit() {
    this.allocationService.getRiskMetrics().subscribe(data => {
      this.metrics = data;
    });
  }
}