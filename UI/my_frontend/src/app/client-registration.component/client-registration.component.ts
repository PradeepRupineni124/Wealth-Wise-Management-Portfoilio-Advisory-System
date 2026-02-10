import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FileUploadModule } from 'primeng/fileupload';

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
    FileUploadModule
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
    riskProfile: 'Moderate - Balanced Growth',    // Default from screenshot
    goal: 'Wealth Accumulation',                  // Default from screenshot
    investmentHorizon: 'Very Long-term (10-15 years)', // Default from screenshot
    liquidityNeeds: 'Low - Rarely need access',   // Default from screenshot
    kycDocument: null,
    kycStatus: 'PENDING'
  };

  riskProfiles = [
    { label: 'Conservative - Preserve Capital', value: 'Conservative - Preserve Capital' },
    { label: 'Moderate - Balanced Growth', value: 'Moderate - Balanced Growth' },
    { label: 'Aggressive - Maximum Growth', value: 'Aggressive - Maximum Growth' }
  ];

  goals = [
    { label: 'Retirement Planning', value: 'Retirement Planning' },
    { label: 'Wealth Accumulation', value: 'Wealth Accumulation' },
    { label: 'Income Generation', value: 'Income Generation' },
    { label: 'Capital Preservation', value: 'Capital Preservation' }
  ];

  horizons = [
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
    if (this.clientData.fullName && this.clientData.email) {
      this.clientData.kycStatus = this.clientData.kycDocument ? 'SUBMITTED' : 'PENDING';
      this.onClientAdded.emit(this.clientData);
      this.visible = false;
      this.resetForm();
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
      riskProfile: 'Moderate - Balanced Growth',
      goal: 'Wealth Accumulation',
      investmentHorizon: 'Very Long-term (10-15 years)',
      liquidityNeeds: 'Low - Rarely need access',
      kycDocument: null,
      kycStatus: 'PENDING'
    };
  }
}