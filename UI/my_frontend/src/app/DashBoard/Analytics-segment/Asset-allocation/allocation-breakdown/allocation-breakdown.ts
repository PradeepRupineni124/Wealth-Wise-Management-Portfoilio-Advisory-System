import { Component, OnInit, inject } from '@angular/core'; 
import { CommonModule } from '@angular/common';


import { AllocationService ,Sector} from '../../../../allocation.service';

@Component({
  selector: 'app-allocation-breakdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './allocation-breakdown.html',
  styleUrls: ['./allocation-breakdown.css']
})
export class AllocationBreakdownComponent implements OnInit {
  

  private allocationService = inject(AllocationService);

  
  sectors: Sector[] = [];


  ngOnInit(): void {
    this.allocationService.getAllocationData().subscribe((data) => {
      this.sectors = data;
    });
  }
}