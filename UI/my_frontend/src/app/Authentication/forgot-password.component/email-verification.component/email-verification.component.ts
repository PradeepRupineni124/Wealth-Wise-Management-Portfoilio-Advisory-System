import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputOtpModule } from 'primeng/inputotp';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [ReactiveFormsModule, InputOtpModule, ButtonModule, CardModule, RouterModule, ToastModule],
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private messageService = inject(MessageService);
  
  isVerifying = signal(false);

  otpForm = this.fb.group({
    otp: ['', [Validators.required, Validators.minLength(4)]]
  });

  onVerifyOtp() {
    if (this.otpForm.invalid) return;

    this.isVerifying.set(true);

    setTimeout(() => {
        this.isVerifying.set(false);
        this.messageService.add({ severity: 'success', summary: 'Verified', detail: 'OTP verified successfully.' });
        
        // Delay navigation
        setTimeout(() => {
            this.router.navigate(['/reset-password']);
        }, 1500);
    }, 1000);
  }

  onResend() {
    // 1. Clear the Input
    this.otpForm.reset();
    
    // 2. Show Toast
    this.messageService.add({ 
        severity: 'info', 
        summary: 'Resent', 
        detail: 'A new code has been sent to your email.' 
    });
  }
}