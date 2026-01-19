import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';

import { AllocationService,Sector } from '../../../../allocation.service';

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
  
  
  currentSectors: Sector[] = [];

  ngOnInit() {
    
    this.allocationService.getAllocationData().subscribe((sectors: Sector[]) => {
      
      this.currentSectors = sectors;

      
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

    
    this.options = {
      plugins: {
        legend: {
          display: false 
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