import { Component , inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PasswordModule } from 'primeng/password';

import { MessageService } from 'primeng/api';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import {MessageModule} from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import {CardModule} from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import {DividerModule} from 'primeng/divider';
import { AuthService } from '../auth-service';



@Component({
  selector: 'app-registration',
  imports: [PasswordModule, 
    ReactiveFormsModule, 
    CommonModule, 
    ToastModule,
    InputTextModule,
    MessageModule,
  FloatLabelModule,
  CardModule,
ButtonModule,
RouterModule,
DividerModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
  providers: [MessageService]
})
export class Registration {


  private router = inject(Router);

  private service = inject(AuthService); 

  registerForm: any;

  constructor(private fb: FormBuilder, private messageService: MessageService) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatch });
  }

  passwordMatch(control: AbstractControl) {
    const pwd = control.get('password')?.value;
    const cpwd = control.get('confirmPassword')?.value;
    return pwd === cpwd ? null : { mismatch: true };
  }

  isInvalid(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  isDarkMode = false;


  submit() {
    if (this.registerForm.valid) {
      // 1. Prepare the data from the form
      // Make sure these field names match what your Java 'RegisterRequest' class expects
      const userData = this.registerForm.value;

      // 2. Call the AuthService to send data to Backend
      this.service.register(userData).subscribe({
        
        // --- SUCCESS CASE (Backend saved it) ---
        next: (response) => {
          console.log('Registration successful', response);

          this.messageService.add({
            severity: 'success',
            summary: 'Registration Successful',
            detail: 'User registered successfully. Redirecting...'
          });

          // Optional: Clear form
          this.registerForm.reset();

          // Redirect after a short delay
          setTimeout(() => {
            // Usually, after registration, you send them to Login, not Dashboard
            this.router.navigate(['/login']); 
          }, 1000);
        },

        // --- ERROR CASE (Backend rejected it) ---
        error: (err) => {
          console.error('Registration failed', err);
          
          this.messageService.add({
            severity: 'error',
            summary: 'Registration Failed',
            detail: err.error || 'Something went wrong during registration.'
          });
        }
      });

    } else {
      // Form is invalid (e.g., missing fields)
      this.registerForm.markAllAsTouched();
      
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Form',
        detail: 'Please check the fields and try again.'
      });
    }
  }

}
