import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-client-registration',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    FormsModule,
    FileUploadModule,
    InputNumberModule 
  ],
  templateUrl: './client-registration.component.html',
  styleUrl: './client-registration.component.css',
})
export class ClientRegistrationComponent {
  @Output() onClientAdded = new EventEmitter<any>();
  
  visible: boolean = false;

  clientData: any = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    occupation: '',
    employer: '',
    investmentAmount: null, 
    riskProfile: 'MODERATE',
    goal: 'WEALTH_ACCUMULATION',
    investmentHorizon: 'VERY_LONG_TERM',
    liquidityNeeds: 'LOW',
    kycDocument: null,
    kycStatus: 'PENDING'
  };

  riskProfiles = [
    { label: 'Conservative - Preserve Capital', value: 'CONSERVATIVE' },
    { label: 'Moderate - Balanced Growth', value: 'MODERATE' },
    { label: 'Aggressive - Maximum Growth', value: 'AGGRESSIVE' }
  ];

  goals = [
    { label: 'Retirement Planning', value: 'RETIREMENT_PLANNING' },
    { label: 'Wealth Accumulation', value: 'WEALTH_ACCUMULATION' },
    { label: 'Income Generation', value: 'INCOME_GENERATION' },
    { label: 'Capital Preservation', value: 'CAPITAL_PRESERVATION' }
  ];

  horizons = [
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

  showDialog() {
    this.visible = true;
  }

  onFileSelect(event: any) {
    if (event.files && event.files.length > 0) {
      this.clientData.kycDocument = event.files[0];
    }
  }

  onHide() {
    this.visible = false;
  }

  onSubmit() {
    if (this.clientData.fullName && this.clientData.email && this.clientData.investmentAmount) {
      this.onClientAdded.emit(this.clientData);
      this.visible = false;
      this.resetForm();
    } else {
      console.error('Please fill in all required fields.');
    }
  }

  resetForm() {
    this.clientData = {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      occupation: '',
      employer: '',
      investmentAmount: null, 
      riskProfile: 'MODERATE',
      goal: 'WEALTH_ACCUMULATION',
      investmentHorizon: 'VERY_LONG_TERM',
      liquidityNeeds: 'LOW',
      kycDocument: null,
      kycStatus: 'PENDING'
    };
  }
}