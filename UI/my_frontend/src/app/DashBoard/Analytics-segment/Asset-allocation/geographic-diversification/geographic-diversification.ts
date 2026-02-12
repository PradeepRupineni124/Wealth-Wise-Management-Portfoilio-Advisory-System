import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AllocationService,Region } from '../../../../services/allocation.service';

@Component({
  selector: 'app-geographic-diversification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './geographic-diversification.html',
  styleUrls: ['./geographic-diversification.css']
})
export class GeographicDiversificationComponent implements OnInit {
  
  private allocationService = inject(AllocationService);
  

  regions: Region[] = [];

  ngOnInit(): void {
    this.allocationService.getGeographicData().subscribe(data => {
      this.regions = data;
    });
  }
}