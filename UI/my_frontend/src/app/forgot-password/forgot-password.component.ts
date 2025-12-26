import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, inject, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { InputOtp } from 'primeng/inputotp';
import { PasswordModule } from 'primeng/password';
import { Button } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { Ripple } from 'primeng/ripple';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    Card,
    InputText,
    InputOtp,
    PasswordModule,
    Button,
    Toast,
    Ripple
  ],
  providers: [MessageService],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPassword {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private messageService = inject(MessageService);

  // ----- Step State -----
  currentStep = signal<1 | 2 | 3>(1);
  stepHeaderTitle = computed(() => {
    switch (this.currentStep()) {
      case 1: return 'Forgot Password';
      case 2: return 'Email Verification';
      default: return 'Reset Password';
    }
  });

  // ----- Forms -----
  emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  otpForm = this.fb.group({
    otp: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]]
  });

  resetForm = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    },
    { validators: [this.passwordsMatchValidator] }
  );

  // ----- Refs for Autofocus -----
  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;
  @ViewChild('otpRoot') otpRoot!: ElementRef<HTMLDivElement>;
  @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;

  ngAfterViewInit() {
    // Focus first field for initial step
    setTimeout(() => this.emailInput?.nativeElement.focus(), 50);
  }

  // ----- Navigation -----
  goToStep(n: 1 | 2 | 3) {
    this.currentStep.set(n);
    setTimeout(() => {
      if (n === 1) {
        this.emailInput?.nativeElement.focus();
      } else if (n === 2) {
        const firstOtpInput = this.otpRoot?.nativeElement.querySelector('input');
        (firstOtpInput as HTMLInputElement | null)?.focus();
      } else {
        this.passwordInput?.nativeElement.focus();
      }
    }, 50);
  }

  onBack() {
    const step = this.currentStep();
    if (step === 1) {
      this.router.navigateByUrl('/login');
    } else {
      this.goToStep((step - 1) as 1 | 2 | 3);
    }
  }

  // ----- Validators -----
  private passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const pw = group.get('password')?.value;
    const cpw = group.get('confirmPassword')?.value;
    return pw && cpw && pw !== cpw ? { mismatch: true } : null;
  }

  // ----- Actions -----
  onRecover() {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }
    this.messageService.add({
      severity: 'success',
      summary: 'Code Sent',
      detail: 'We have sent a 4-digit verification code to your email.'
    });
    this.goToStep(2);
  }

  onVerifyOtp() {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }
    this.messageService.add({
      severity: 'success',
      summary: 'Verified',
      detail: 'OTP verified successfully.'
    });
    this.goToStep(3);
  }

  onResend() {
    this.messageService.add({ severity: 'info', summary: 'Code resent', detail: 'A new code was sent to your email.' });
    // Optional mock timer or UI effects can be added here if needed.
  }

  onReset() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }
    this.messageService.add({
      severity: 'success',
      summary: 'Password updated',
      detail: 'Your password has been updated.'
    });
    // Reset all and go back to Step 1
    this.emailForm.reset();
    this.otpForm.reset();
    this.resetForm.reset();
    this.goToStep(1);
  }

  // ----- Keyboard & Input Handling -----
  submitOnEnterStep1() { this.onRecover(); }
  submitOnEnterStep2() { this.onVerifyOtp(); }
  submitOnEnterStep3() { this.onReset(); }

  preventPaste(evt: ClipboardEvent) {
    evt.preventDefault();
  }

  restrictNonDigits(evt: KeyboardEvent) {
    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (/\d/.test(evt.key) || allowed.includes(evt.key)) return;
    evt.preventDefault();
  }

  // ----- Getters for template -----
  get emailCtrl() { return this.emailForm.get('email'); }
  get otpCtrl() { return this.otpForm.get('otp'); }
  get passwordCtrl() { return this.resetForm.get('password'); }
  get confirmPasswordCtrl() { return this.resetForm.get('confirmPassword'); }
}
