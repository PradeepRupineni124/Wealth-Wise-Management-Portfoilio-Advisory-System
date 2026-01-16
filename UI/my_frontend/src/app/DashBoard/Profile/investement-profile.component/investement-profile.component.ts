import { Component, effect, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { SelectModule } from 'primeng/select';

// Simple shapes for our data
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
  // 1. TOOLS
  // Use FormBuilder to create the form easily
  private fb = inject(FormBuilder);

  // 2. INPUTS (Signals)
  // Data coming from the Parent (Dashboard). 
  // 'input' signals automatically notify us when they change.
  isEditMode = input(false);
  profileData = input<InvestmentProfile | null>(null);
  
  // This is just for display (the text at the bottom or top of the card)
  summary = input({ allocation: 'Pending...', score: '-', return: '-' });

  // 3. THE FORM
  // We create the 4 empty fields here.
  investForm = this.fb.group({
    riskProfile: [''],
    goal:        [''],
    horizon:     [''],
    liquidity:   ['']
  });

  // 4. DROPDOWN OPTIONS
  // These are the lists the user sees in the dropdowns.
  riskOptions = [
    { label: 'Conservative', value: 'Conservative' },
    { label: 'Moderate',     value: 'Moderate' },
    { label: 'Aggressive',   value: 'Aggressive' }
  ];

  goalOptions = [
    { label: 'Retirement',   value: 'Retirement' },
    { label: 'Wealth',       value: 'Wealth' },
    { label: 'Income',       value: 'Income' }
  ];

  horizonOptions = [
    { label: 'Short (0-3 yrs)',  value: 'Short' },
    { label: 'Medium (3-7 yrs)', value: 'Medium' },
    { label: 'Long (7+ yrs)',    value: 'Long' }
  ];

  liquidityOptions = [
    { label: 'Low',    value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High',   value: 'High' }
  ];

  constructor() {
    // 5. WATCHER: Handle Edit Mode
    // Runs automatically when 'isEditMode' changes.
    effect(() => {
      if (this.isEditMode()) {
        this.investForm.enable(); // Unlock dropdowns
      } else {
        this.investForm.disable(); // Lock dropdowns
      }
    });

    // 6. WATCHER: Handle New Data
    // Runs automatically when 'profileData' changes.
    effect(() => {
      const data = this.profileData();
      
      // If we received data, put it into the form
      if (data) {
        this.investForm.patchValue(data);
      }
    });
  }

  // 7. HELPER: Get Data
  // The parent calls this when clicking "Save".
  getFormData() {
    return this.investForm.valid ? this.investForm.value : null;
  }
}