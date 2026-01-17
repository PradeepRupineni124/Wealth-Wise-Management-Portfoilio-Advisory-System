import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

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

    this.loading.set(true);

    // Simulate API Call
    setTimeout(() => {
      this.loading.set(false);
      
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Code Sent', 
        detail: 'Check your inbox for the verification code.' 
      });

      // Delay navigation so Toast is visible
      setTimeout(() => {
        this.router.navigate(['/email-verification']); 
      }, 1500);
      
    }, 1000);
  }
}