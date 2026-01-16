import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
// Import the Service and Interface
import { AllocationService,PerformanceData } from '../../../../allocation.service'; // <--- CHECK PATH

@Component({
  selector: 'app-graph1',
  standalone: true,
  imports: [CommonModule, ChartModule, SelectButtonModule, FormsModule],
  templateUrl: './graph1.html',
  styleUrls: ['./graph1.css']
})
export class Graph1Component implements OnInit {
  
  // 1. Inject the Service
  private allocationService = inject(AllocationService);

  data: any;
  options: any;
  
  timeOptions = [
    { label: '1M', value: '1M' },
    { label: '3M', value: '3M' },
    { label: '6M', value: '6M' },
    { label: '1Y', value: '1Y' },
    { label: 'All', value: 'All' }
  ];
  selectedTime: string = 'All';

  ngOnInit() {
    // 2. Subscribe to the Service Data
    this.allocationService.getPerformanceData().subscribe((response: PerformanceData) => {
      
      // Update the chart data dynamically
      this.data = {
        labels: response.labels,
        datasets: response.datasets
      };
      
    });

    // 3. Keep Options Static (Visual settings don't usually change with data)
    this.options = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { usePointStyle: true, padding: 20 }
        }
      },
      scales: {
        y: {
          ticks: { callback: (value: any) => value + '%' },
          grid: { color: '#f1f5f9' }
        },
        x: {
          grid: { display: false }
        }
      }
    };
  }
}