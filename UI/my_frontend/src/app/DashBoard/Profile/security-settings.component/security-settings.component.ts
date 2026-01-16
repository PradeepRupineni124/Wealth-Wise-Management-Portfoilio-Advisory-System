import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';

// PrimeNG Imports
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-security-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PasswordModule, ButtonModule, ToastModule],
  templateUrl: './security-settings.component.html',
  styleUrl: './security-settings.component.css',
})
export class SecuritySettingsComponent {
  // 1. TOOLS
  // We need FormBuilder for the form and MessageService for the popup alerts.
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  // 2. DATA
  // A simple list to show where user logged in recently
  loginHistory = [
    { device: 'Chrome on Windows', location: 'New York, NY', date: '2026-01-06 09:23 AM', icon: 'pi pi-desktop' },
    { device: 'Safari on iPhone',  location: 'New York, NY', date: '2026-01-05 06:45 PM', icon: 'pi pi-mobile' },
    { device: 'Chrome on Windows', location: 'New York, NY', date: '2026-01-05 08:15 AM', icon: 'pi pi-desktop' }
  ];

  // 3. THE FORM
  // We create the form with 3 fields and one special rule at the end.
  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword:     ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.checkPasswordsMatch }); 
twoFactorEnabled: boolean = true;

  // 4. HELPER: The "Match" Rule
  // This runs automatically to check if New Password == Confirm Password
  checkPasswordsMatch(group: AbstractControl) {
    const pass = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;

    // If they match, return null (no error). If not, return an error object.
    return pass === confirm ? null : { mismatch: true };
  }

  // 5. ACTION: Submit
  onUpdatePassword() {
    // Check if form is valid (Green)
    if (this.passwordForm.valid) {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Password updated!' });
      this.passwordForm.reset();
    } else {
      // If invalid (Red), show error and highlight red fields
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fix the errors.' });
      this.passwordForm.markAllAsTouched();
    }
  }
}