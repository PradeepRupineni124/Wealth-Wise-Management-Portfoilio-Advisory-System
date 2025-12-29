
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';        
import { MessageService } from 'primeng/api';       

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    InputNumberModule,
    ButtonModule,
    MessageModule,
    ToastModule                                   
  ],
  templateUrl: './registration.html',
  styleUrls: ['./registration.css'],
  providers: [MessageService]                      
})
export class Registration {
  submitted = false;
  registrationForm!: FormGroup;

  constructor(private fb: FormBuilder, private messageService: MessageService) {
    this.registrationForm = this.fb.group(
      {
        username: ['', Validators.required],
        name: ['', Validators.required],
        age: [null, [Validators.required, Validators.min(1)]],
        email: ['', [Validators.required, this.containsAtValidator]],
        password: ['', [Validators.required, this.passwordStrengthValidator]],
        confirmPassword: ['', Validators.required]
      },
      { validators: [this.matchPasswordsValidator] }
    );
  }

  /** Show test toast when clicking the "Show" button */
  show(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Test Toast',
      detail: 'This is a responsive toast.',
      life: 3000
    });
  }

  /** Helper to toggle invalid UI state */
  isInvalid(controlName: string): boolean {
    const control = this.registrationForm.get(controlName);
    return !!(control && (control.touched || this.submitted) && control.invalid);
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.registrationForm.valid) {
      
      this.messageService.add({
        severity: 'success',
        summary: 'Registration Successful',
        detail: `Welcome, ${this.registrationForm.get('username')?.value}!`,
        life: 3500
      });

      console.log('Registration payload:', this.registrationForm.value);
    } else {
      this.registrationForm.markAllAsTouched();

      
      this.messageService.add({
        severity: 'error',
        summary: 'Please fix the errors',
        detail: 'Check the highlighted fields and try again.',
        life: 4000
      });
    }
  }

  /** Email must contain '@' */
  private containsAtValidator(control: AbstractControl): ValidationErrors | null {
    const value = (control.value ?? '') as string;
    return value.includes('@') && value.includes('mail.com') ? null : { atMissing: true };
  }

  /** Password must contain at least one uppercase, one number, and one special character */
  private passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = (control.value ?? '') as string;
    if (!value) return null;
    const hasUpper = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecial = /[^A-Za-z0-9]/.test(value);

    return hasUpper && hasNumber && hasSpecial
      ? null
      : { weakPassword: { hasUpper, hasNumber, hasSpecial } };
  }

  /** Cross-field validator: password === confirmPassword */
  private matchPasswordsValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    if (!password || !confirm) return null;
    return password === confirm ? null : { passwordsMismatch: true };
  }
}
