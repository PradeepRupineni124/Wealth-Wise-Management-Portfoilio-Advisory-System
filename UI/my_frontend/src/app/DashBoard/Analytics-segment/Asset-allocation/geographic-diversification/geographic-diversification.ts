import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// Import Service and BOTH Interfaces (if needed, but definitely Region)
import { AllocationService,Region } from '../../../../allocation.service';

@Component({
  selector: 'app-geographic-diversification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './geographic-diversification.html',
  styleUrls: ['./geographic-diversification.css']
})
export class GeographicDiversificationComponent implements OnInit {
  
  private allocationService = inject(AllocationService);
  
  // Initialize with empty array typed to Region
  regions: Region[] = [];

  ngOnInit(): void {
    this.allocationService.getGeographicData().subscribe(data => {
      this.regions = data;
    });
  }
}