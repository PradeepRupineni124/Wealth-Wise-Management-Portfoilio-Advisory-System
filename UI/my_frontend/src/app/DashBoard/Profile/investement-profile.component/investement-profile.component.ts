import { Component, effect, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { SelectModule } from 'primeng/select';

export interface InvestmentProfile {
  riskProfile: string;
  goal: string;
  horizon: string;
  liquidity: string;
}

@Component({
  selector: 'app-investement-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectModule],
  templateUrl: './investement-profile.component.html',
  styleUrl: './investement-profile.component.css',
})
export class InvestementProfileComponent {
 
  private fb = inject(FormBuilder);

  isEditMode = input(false);
  profileData = input<InvestmentProfile | null>(null);
  
  summary = input({ allocation: 'Pending...', score: '-', return: '-' });

  investForm = this.fb.group({
    riskProfile: [''],
    goal:        [''],
    horizon:     [''],
    liquidity:   ['']
  });

  // --- UPDATED DROPDOWN OPTIONS (Values match Spring Boot Enums) ---

  riskOptions = [
    { label: 'Conservative - Preserve Capital', value: 'CONSERVATIVE' },
    { label: 'Moderate - Balanced Growth', value: 'MODERATE' },
    { label: 'Aggressive - Maximum Growth', value: 'AGGRESSIVE' }
  ];

  goalOptions = [
    { label: 'Retirement Planning', value: 'RETIREMENT_PLANNING' },
    { label: 'Wealth Accumulation', value: 'WEALTH_ACCUMULATION' },
    { label: 'Income Generation', value: 'INCOME_GENERATION' },
    { label: 'Capital Preservation', value: 'CAPITAL_PRESERVATION' }
  ];

  horizonOptions = [
    { label: 'Short-term (0-3 years)', value: 'SHORT_TERM' },
    { label: 'Medium-term (3-7 years)', value: 'MEDIUM_TERM' },
    { label: 'Long-term (7-10 years)', value: 'LONG_TERM' },
    { label: 'Very Long-term (10-15 years)', value: 'VERY_LONG_TERM' }
  ];

  liquidityOptions = [
    { label: 'Low - Rarely need access', value: 'LOW' },
    { label: 'Medium - Occasional access', value: 'MEDIUM' },
    { label: 'High - Frequent access needed', value: 'HIGH' }
  ];

  // --------------------------------

  constructor() {
    // Toggle Edit Mode
    effect(() => {
      if (this.isEditMode()) {
        this.investForm.enable();
      } else {
        this.investForm.disable(); 
      }
    });

    // Load Data
    effect(() => {
      const data = this.profileData();
      
      if (data) {
        // Now the backend Enums will successfully match the dropdown values!
        this.investForm.patchValue(data);
      }
    });
  }

  getFormData() {
    return this.investForm.valid ? this.investForm.value : null;
  }
}