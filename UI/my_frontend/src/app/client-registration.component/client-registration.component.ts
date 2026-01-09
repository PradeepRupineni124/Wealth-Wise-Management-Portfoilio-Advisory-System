import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select'; // <--- ADD THIS IMPORT

@Component({
  selector: 'app-client-registration.component',
  imports: [
    ButtonModule,
    DialogModule,
    InputTextModule,
    SelectModule],
  templateUrl: './client-registration.component.html',
  styleUrl: './client-registration.component.css',
})
export class ClientRegistrationComponent {
   displayRegistration: boolean = false;

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
    this.displayRegistration = false;
  }
}
