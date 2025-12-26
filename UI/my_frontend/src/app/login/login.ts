import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth-service'; 
import { MessageService } from 'primeng/api';
// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    ToastModule,
    InputTextModule,
    FloatLabelModule,
    ButtonModule,
    PasswordModule,
    CardModule,
    MessageModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private service = inject(AuthService); // Renamed to 'service' to match your original code
  private messageService = inject(MessageService);

  // 1. Define the Form Group
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  isDarkMode = false;

  // 2. Toggle Logic
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    const element = document.querySelector('html');
    if (element) {
      // Uses your specific class logic
      element.classList.toggle('my-app-dark');
    }
  }

  // 2. THIS IS THE MISSING METHOD CAUSING THE ERROR
  isInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    // Returns true if the control is invalid AND has been touched/dirty
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // Access values using .value
      const { email, password } = this.loginForm.value;
      console.log('Login attempt with:', { email, password });

      const success = this.service.validateData(email, password);

      if (success) {
        this.messageService.add({
          severity: 'success',
          summary: 'Login Successful',
          detail: 'Welcome back, Admin!'
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: 'The email or password you entered is incorrect.'
        });
      }
    } else {
      // If invalid, mark all fields as touched so errors appear immediately
      this.loginForm.markAllAsTouched();
    }
  }
}