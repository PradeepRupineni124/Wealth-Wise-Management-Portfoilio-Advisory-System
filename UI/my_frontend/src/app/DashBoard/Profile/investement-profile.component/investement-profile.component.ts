import { Component, effect, inject, input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
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
  
  // 🚨 1. Inject ChangeDetectorRef to force the frozen dropdowns to wake up
  private cdr = inject(ChangeDetectorRef); 

  isEditMode = input(false);
  profileData = input<InvestmentProfile | null>(null);
  
  summary = input({ allocation: 'Pending...', score: '-', return: '-' });

  investForm = this.fb.group({
    riskProfile: ['', Validators.required],
    goal:        ['', Validators.required],
    horizon:     ['', Validators.required],
    liquidity:   ['', Validators.required]
  });

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

  constructor() {
    
    // 🚨 2. Wrap the enable/disable logic in a setTimeout!
    // This pushes the command to the next frame, giving PrimeNG time to realize it is no longer hidden.
    effect(() => {
      const isEdit = this.isEditMode();
      
      setTimeout(() => {
        if (isEdit) {
          this.investForm.enable(); 
        } else {
          this.investForm.disable(); 
        }
        // Force the screen to redraw the dropdowns
        this.cdr.detectChanges(); 
      }, 0);
    });

    // Load Data
    effect(() => {
      const data = this.profileData();
      if (data) {
        setTimeout(() => {
          this.investForm.patchValue(data);
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }

  getFormData() {
    return this.investForm.valid ? this.investForm.value : null;
  }
}