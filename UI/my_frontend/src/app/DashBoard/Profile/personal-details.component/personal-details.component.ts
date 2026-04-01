import { Component, effect, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-personal-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DatePickerModule,
    IconFieldModule,
    InputIconModule
  ],
  templateUrl: './personal-details.component.html',
  styleUrl: './personal-details.component.css'
})
export class PersonalDetailsComponent {
  
  private fb = inject(FormBuilder);

  
  isEditMode = input(false);     
  personalData = input<any>(null); 

 
  profileForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    dob: [null as Date | null, Validators.required],
    address: ['', Validators.required],
    occupation: ['', Validators.required],
    employer: ['', Validators.required]
  });

  constructor() {
 
    effect(() => {
      if (this.isEditMode()) {
        this.profileForm.enable(); 
      } else {
        this.profileForm.disable(); 
      }
    });

    effect(() => {
      const data = this.personalData();

      if (data) {
        
        if (typeof data.dob === 'string') {
          data.dob = new Date(data.dob);
        }

       
        this.profileForm.patchValue(data);
      }
    });
  }

 
  getFormData() {
   
    if (this.profileForm.valid) {
      return this.profileForm.value;
    }

    
    this.profileForm.markAllAsTouched();
    return null;
  }
}