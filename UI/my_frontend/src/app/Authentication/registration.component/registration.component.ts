import { Component } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PasswordModule } from 'primeng/password';
// import { SelectModule } from 'primeng/select';
// import { Router } from '@angular/router';
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
    // Returns true if the control is invalid AND has been touched/dirty
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  isDarkMode = false;

  // toggleDarkMode() {
  //   this.isDarkMode = !this.isDarkMode;
  // }

  submit() {
    if (this.registerForm.valid) {

      this.messageService.add({
        severity: 'success',
        summary: 'Registration Successful',
        detail: 'User registered successfully'
      });
      this.registerForm.reset();
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

}
