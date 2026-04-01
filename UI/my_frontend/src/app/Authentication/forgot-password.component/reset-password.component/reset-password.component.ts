import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../auth-service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, PasswordModule, ButtonModule, CardModule, RouterModule, ToastModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  
  isLoading = signal(false);
  currentEmail: string | null = null;

  resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.matchPassword }
  );

  ngOnInit() {
    // 1. Ensure we still have the email
    this.currentEmail = this.authService.recoveryEmail();

    if (!this.currentEmail) {
      this.router.navigate(['/forgot-password']);
    }
  }

  matchPassword(g: AbstractControl) {
    return g.get('password')?.value === g.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  onReset() {
    if (this.resetForm.invalid || !this.currentEmail) return;
    
    this.isLoading.set(true);
    const newPassword = this.resetForm.get('password')?.value;

    // Call Real Backend API
    this.authService.resetPassword(this.currentEmail, newPassword!).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Password Reset Successful!' });
        
        // Clear the stored email for security
        this.authService.recoveryEmail.set(null);

        setTimeout(() => {
            this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.messageService.add({ 
            severity: 'error', 
            summary: 'Failed', 
            detail: err.error?.message || 'Password reset failed. Session may have expired.' 
        });
      }
    });
  }
}