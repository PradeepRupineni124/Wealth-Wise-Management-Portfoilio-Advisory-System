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
  // 1. TOOLS
  // We need FormBuilder to create forms easily.
  private fb = inject(FormBuilder);

  // 2. INPUTS (Signals)
  // These act like live variables. When the Parent changes them, we get notified.
  isEditMode = input(false);       // Default is false (Not editing)
  personalData = input<any>(null); // Default is null (No data yet)

  // 3. THE FORM
  // We define the fields and their rules (Validators)
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
    // 4. WATCHER: Handle Edit Mode
    // This runs automatically whenever 'isEditMode' changes.
    effect(() => {
      if (this.isEditMode()) {
        this.profileForm.enable(); // Unlock fields
      } else {
        this.profileForm.disable(); // Lock fields (make them gray)
      }
    });

    // 5. WATCHER: Handle New Data
    // This runs automatically whenever 'personalData' changes.
    effect(() => {
      const data = this.personalData();

      // Only run if we actually have data
      if (data) {
        // Fix Date: Convert string dates to real Date objects if needed
        if (typeof data.dob === 'string') {
          data.dob = new Date(data.dob);
        }

        // Fill the form with the data
        this.profileForm.patchValue(data);
      }
    });
  }

  // 6. HELPER: Get Data for Saving
  // The parent calls this when the user clicks "Save".
  getFormData() {
    // If form is valid (green), give the data
    if (this.profileForm.valid) {
      return this.profileForm.value;
    }

    // If form is invalid (red), show error borders and return nothing
    this.profileForm.markAllAsTouched();
    return null;
  }
}