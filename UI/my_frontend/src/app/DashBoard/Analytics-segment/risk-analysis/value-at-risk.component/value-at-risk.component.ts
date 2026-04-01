import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllocationService,VaRMetric } from '../../../../services/allocation.service'; 
@Component({
  selector: 'app-value-at-risk',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './value-at-risk.component.html',
  styleUrls: ['./value-at-risk.component.css']
})
export class ValueAtRiskComponent implements OnInit {
  
  private allocationService = inject(AllocationService);
  varData: VaRMetric[] = [];

  ngOnInit() {
    this.allocationService.getVaRData().subscribe(data => {
      this.varData = data;
    });
  }
}