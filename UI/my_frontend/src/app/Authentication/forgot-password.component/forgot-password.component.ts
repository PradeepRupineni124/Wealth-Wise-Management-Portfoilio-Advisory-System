import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CardModule, InputTextModule, ButtonModule, RouterModule, ToastModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private authService = inject(AuthService); // Inject AuthService

  loading = signal(false);

  // Custom Validator for Gmail
  gmailValidator(control: AbstractControl) {
    const value = control.value;
    if (value && !value.toLowerCase().endsWith('@gmail.com')) {
      return { gmail: true };
    }
    return null;
  }

  emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email, this.gmailValidator]]
  });

  onRecover() {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    const email = this.emailForm.get('email')?.value;
    this.loading.set(true);

    // Call Real Backend API
    this.authService.forgotPassword(email!).subscribe({
      next: (response) => {
        this.loading.set(false);

        // 1. Store email in service for the next step
        this.authService.recoveryEmail.set(email!);

        this.messageService.add({
          severity: 'success',
          summary: 'Code Sent',
          detail: 'Check your inbox for the verification code.'
        });

        // 2. Navigate to OTP screen
        setTimeout(() => {
          this.router.navigate(['/email-verification']);
        }, 1000);
      },
      error: (err) => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Failed to send OTP. User may not exist.'
        });
      }
    });
  }
}