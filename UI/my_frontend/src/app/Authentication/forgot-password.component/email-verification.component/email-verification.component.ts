import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputOtpModule } from 'primeng/inputotp';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../auth-service';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [ReactiveFormsModule, InputOtpModule, ButtonModule, CardModule, RouterModule, ToastModule],
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);

  isVerifying = signal(false);
  currentEmail: string | null = null;

  otpForm = this.fb.group({
    otp: ['', [Validators.required, Validators.minLength(4)]]
  });

  ngOnInit() {
    // 1. Check if we have an email from the previous step
    this.currentEmail = this.authService.recoveryEmail();

    if (!this.currentEmail) {
      this.messageService.add({ severity: 'warn', summary: 'Session Expired', detail: 'Please start over.' });
      this.router.navigate(['/forgot-password']);
    }
  }

  onVerifyOtp() {
    if (this.otpForm.invalid || !this.currentEmail) return;

    this.isVerifying.set(true);
    const otp = this.otpForm.get('otp')?.value;

    // Call Real Backend API
    this.authService.verifyOtp(this.currentEmail, otp!).subscribe({
      next: (response) => {
        this.isVerifying.set(false);
        this.messageService.add({ severity: 'success', summary: 'Verified', detail: 'OTP verified successfully.' });

        setTimeout(() => {
          this.router.navigate(['/reset-password']);
        }, 1000);
      },
      error: (err) => {
        this.isVerifying.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Verification Failed',
          detail: err.error?.message || 'Invalid OTP code.'
        });
      }
    });
  }

  onResend() {
    if (!this.currentEmail) return;

    this.otpForm.reset();

    // Call Forgot Password API again to resend OTP
    this.authService.forgotPassword(this.currentEmail).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Resent',
          detail: 'A new code has been sent to your email.'
        });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not resend code.' });
      }
    });
  }
}