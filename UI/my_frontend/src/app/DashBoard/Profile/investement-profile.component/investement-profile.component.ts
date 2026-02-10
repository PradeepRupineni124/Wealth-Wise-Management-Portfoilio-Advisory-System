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

  // --- UPDATED DROPDOWN OPTIONS ---

  riskOptions = [
    { label: 'Conservative - Preserve Capital', value: 'Conservative - Preserve Capital' },
    { label: 'Moderate - Balanced Growth', value: 'Moderate - Balanced Growth' },
    { label: 'Aggressive - Maximum Growth', value: 'Aggressive - Maximum Growth' }
  ];

  goalOptions = [
    { label: 'Retirement Planning', value: 'Retirement Planning' },
    { label: 'Wealth Accumulation', value: 'Wealth Accumulation' },
    { label: 'Income Generation', value: 'Income Generation' },
    { label: 'Capital Preservation', value: 'Capital Preservation' }
  ];

  horizonOptions = [
    { label: 'Short-term (0-3 years)', value: 'Short-term (0-3 years)' },
    { label: 'Medium-term (3-7 years)', value: 'Medium-term (3-7 years)' },
    { label: 'Long-term (7-10 years)', value: 'Long-term (7-10 years)' },
    { label: 'Very Long-term (10-15 years)', value: 'Very Long-term (10-15 years)' }
  ];

  liquidityOptions = [
    { label: 'Low - Rarely need access', value: 'Low - Rarely need access' },
    { label: 'Medium - Occasional access', value: 'Medium - Occasional access' },
    { label: 'High - Frequent access needed', value: 'High - Frequent access needed' }
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
        this.investForm.patchValue(data);
      }
    });
  }

  getFormData() {
    return this.investForm.valid ? this.investForm.value : null;
  }
}