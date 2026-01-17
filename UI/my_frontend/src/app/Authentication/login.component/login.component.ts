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
  private router = inject(Router); // 2. Inject the Router

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
      
      const success = this.service.validateData(email, password);

      if (success) {
        this.messageService.add({
          severity: 'success',
          summary: 'Login Successful',
          detail: 'Welcome back! Redirecting...'
        });
        
        // 3. Navigate to Dashboard
        // Optional: Add a slight delay if you want the user to read the toast
        setTimeout(() => {
             this.router.navigate(['/admin/overview']); 
        }, 500);

      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: 'The email or password you entered is incorrect.'
        });
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}