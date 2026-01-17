import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, PasswordModule, ButtonModule, CardModule, RouterModule, ToastModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private messageService = inject(MessageService);
  
  isLoading = signal(false);

  resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.matchPassword }
  );

  matchPassword(g: AbstractControl) {
    return g.get('password')?.value === g.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  onReset() {
    if (this.resetForm.invalid) return;
    
    this.isLoading.set(true);

    setTimeout(() => {
        this.isLoading.set(false);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Password Reset Successful!' });
        
        // Delay navigation
        setTimeout(() => {
            this.router.navigate(['/login']);
        }, 1500);
    }, 1000);
  }
}