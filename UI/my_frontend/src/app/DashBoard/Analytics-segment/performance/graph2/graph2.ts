import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
// Import Service and Interface
import { AllocationService,AssetMetric } from '../../../../allocation.service';// Check path

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
    // 1. Subscribe to the service
    this.allocationService.getAssetMetrics().subscribe((metrics: AssetMetric[]) => {
      
      // 2. Map data to ChartJS format
      this.data = {
        labels: metrics.map(m => m.label), // ['Equities', 'Bonds'...]
        datasets: [
          {
            label: 'Market Value ($)',
            backgroundColor: '#3b82f6', // Blue
            data: metrics.map(m => m.value),
            yAxisID: 'y'
          },
          {
            label: 'Return (%)',
            backgroundColor: '#10b981', // Green
            data: metrics.map(m => m.returnRate),
            yAxisID: 'y1'
          }
        ]
      };
    });

    // 3. Keep static visual options
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
            // Converts 1150000 -> $1150K
            callback: (value: number) => '$' + value / 1000 + 'K'
          },
          grid: { color: '#f1f5f9' }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          min: 0,
          max: 20, // Adjusted max for better visualization
          ticks: {
            callback: (value: number) => value + '%'
          },
          grid: { drawOnChartArea: false }
        }
      }
    };
  }
}