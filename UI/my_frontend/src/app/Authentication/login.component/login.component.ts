import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth-service';
import { MessageService } from 'primeng/api';
//Prime ng themes
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';

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
    MessageModule,
    CheckboxModule,
    CardModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private service = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  isInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!(control && control.invalid && (control.touched));
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      // Call the real backend login API
      this.service.login(email, password).subscribe({

        // --- SUCCESS CASE (Backend returns 200 OK) ---
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Login Successful',
            detail: 'Welcome back!' 
          });

          // Navigate immediately
          this.router.navigate(['/admin/overview']);
        },

        // --- ERROR CASE (Backend returns 401 or 400) ---
        error: (err) => {
          console.error('Login failed', err); // Optional debugging

          this.messageService.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: 'The email or password you entered is incorrect.'
          });
        }
      });

    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  handleBack() {
    this.service.logout(); // Triggers the data removal
    this.router.navigate(['/']); // Then moves the user
  }
}