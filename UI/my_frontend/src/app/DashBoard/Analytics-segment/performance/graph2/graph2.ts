import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';

import { AllocationService,AssetMetric } from '../../../../services/allocation.service';

@Component({
  selector: 'app-graph2',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './graph2.html',
  styleUrls: ['./graph2.css']
})
export class Graph2Component implements OnInit {
  
  private allocationService = inject(AllocationService);

  data: any;
  options: any;

  ngOnInit() {
   
    this.allocationService.getAssetMetrics().subscribe((metrics: AssetMetric[]) => {
      
      
      this.data = {
        labels: metrics.map(m => m.label), 
        datasets: [
          {
            label: 'Market Value ($)',
            backgroundColor: '#3b82f6', 
            data: metrics.map(m => m.value),
            yAxisID: 'y'
          },
          {
            label: 'Return (%)',
            backgroundColor: '#10b981', 
            data: metrics.map(m => m.returnRate),
            yAxisID: 'y1'
          }
        ]
      };
    });

    
    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { usePointStyle: true, padding: 20 }
        }
      },
      scales: {
        x: {
          grid: { display: false }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            
            callback: (value: number) => '$' + value / 1000 + 'K'
          },
          grid: { color: '#f1f5f9' }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          min: 0,
          max: 20, 
          ticks: {
            callback: (value: number) => value + '%'
          },
          grid: { drawOnChartArea: false }
        }
      }
    };
  }
}