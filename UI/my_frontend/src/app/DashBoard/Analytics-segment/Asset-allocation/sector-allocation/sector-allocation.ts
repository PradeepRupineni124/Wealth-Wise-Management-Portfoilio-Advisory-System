import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
// Import the Service and Interface
import { AllocationService,Sector } from '../../../../allocation.service';// <--- CHECK PATH

@Component({
  selector: 'app-sector-allocation',
  standalone: true,
  imports: [ChartModule, CommonModule],
  templateUrl: './sector-allocation.html',
  styleUrls: ['./sector-allocation.css']
})
export class SectorAllocationComponent implements OnInit {
  
  private allocationService = inject(AllocationService);

  data: any;
  options: any;
  
  // Local variable to hold data for the HTML Legend
  currentSectors: Sector[] = [];

  ngOnInit() {
    // 1. Subscribe to the Service
    this.allocationService.getAllocationData().subscribe((sectors: Sector[]) => {
      
      this.currentSectors = sectors;

      // 2. Format data for the Chart
      this.data = {
        labels: sectors.map(s => s.name),
        datasets: [
          {
            data: sectors.map(s => s.value),
            backgroundColor: sectors.map(s => s.color),
            borderWidth: 0
          }
        ]
      };
    });

    // 3. Chart Options (Visuals)
    this.options = {
      plugins: {
        legend: {
          display: false // We use our own HTML legend
        },
        tooltip: {
          enabled: true
        }
      },
      cutout: '0%', 
      responsive: true,
      maintainAspectRatio: false
    };
  }
}