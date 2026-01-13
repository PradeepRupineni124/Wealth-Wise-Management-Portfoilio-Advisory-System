import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-registration',
  imports: [ButtonModule,DialogModule,InputTextModule,SelectModule,FormsModule],
  templateUrl: './client-registration.component.html',
  styleUrl: './client-registration.component.css',
})
export class ClientRegistrationComponent {
  @Output() onClientAdded = new EventEmitter<any>(); // Event to send data back

  displayRegistration: boolean = false;

  // Data Model
  clientData = {
    fullName: '',
    email: '',
    phone: '',
    riskProfile: null,
    goal: null
  };

  riskProfiles = [
    { label: 'Low (Conservative)', value: 'low' },
    { label: 'Medium (Balanced)', value: 'medium' },
    { label: 'High (Aggressive)', value: 'high' }
  ];

  goals = [
    { label: 'Retirement', value: 'retirement' },
    { label: 'Wealth Growth', value: 'growth' },
    { label: 'Education', value: 'education' }
  ];

  showDialog() {
    this.displayRegistration = true;
  }

  onSubmit() {
    // 1. Validate (Optional)
    if (this.clientData.fullName) {
        // 2. Emit data to parent
        this.onClientAdded.emit(this.clientData);
        
        // 3. Close and Reset
        this.displayRegistration = false;
        this.resetForm();
    }
  }

  resetForm() {
      this.clientData = { fullName: '', email: '', phone: '', riskProfile: null, goal: null };
  }
}
