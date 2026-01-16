import { Component, OnInit, inject } from '@angular/core'; // Import OnInit and inject
import { CommonModule } from '@angular/common';

// Import BOTH the Service and the Interface from the service fi
import { AllocationService ,Sector} from '../../../../allocation.service';

@Component({
  selector: 'app-allocation-breakdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './allocation-breakdown.html',
  styleUrls: ['./allocation-breakdown.css']
})
export class AllocationBreakdownComponent implements OnInit {
  
  // 1. Inject the service
  private allocationService = inject(AllocationService);

  // 2. Define the property using the Interface (initialize as empty)
  sectors: Sector[] = [];

  // 3. Fetch data when component loads
  ngOnInit(): void {
    this.allocationService.getAllocationData().subscribe((data) => {
      this.sectors = data;
    });
  }
}