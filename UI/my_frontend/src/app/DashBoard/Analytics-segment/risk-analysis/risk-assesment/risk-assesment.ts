import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllocationService,RiskAssessment } from '../../../../allocation.service'; 

@Component({
  selector: 'app-risk-assessment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './risk-assesment.html',
  styleUrls: ['./risk-assesment.css']
})
export class RiskAssessmentComponent implements OnInit {
  
  private allocationService = inject(AllocationService);
  
  
  riskData: RiskAssessment = {
    level: 'Loading...',
    score: 0,
    description: ''
  };

  ngOnInit() {
    this.allocationService.getRiskAssessment().subscribe(data => {
      this.riskData = data;
    });
  }
}