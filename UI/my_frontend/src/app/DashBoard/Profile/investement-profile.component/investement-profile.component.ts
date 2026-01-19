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
    
    effect(() => {
      if (this.isEditMode()) {
        this.investForm.enable();
      } else {
        this.investForm.disable(); 
      }
    });

   
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