import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Services
import { ClientState } from '../../../services/client-state';       
import { ProfileFormatterService } from '../../../services/profile-formatter.service'; 
import { ClientApi } from '../../../services/client-api'; 

// Child Components
import { TabFilterComponent } from '../../../shareable-components/tab-filter.component/tab-filter.component';
import { PersonalDetailsComponent } from '../personal-details.component/personal-details.component';
import { ClientCardComponent } from "../client-card.component/client-card.component";
import { InvestementProfileComponent } from '../investement-profile.component/investement-profile.component';
import { SecuritySettingsComponent } from '../security-settings.component/security-settings.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, ButtonModule, ToastModule, ClientCardComponent, 
    TabFilterComponent, PersonalDetailsComponent, InvestementProfileComponent, SecuritySettingsComponent
  ],
  providers: [MessageService], 
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  
  private clientState = inject(ClientState);   
  private clientApi = inject(ClientApi);       
  private formatter = inject(ProfileFormatterService); 
  private messageService = inject(MessageService); 

  selectedClient = toSignal(this.clientState.currentClient$); 
  
  clientCard = signal<any>({});
  personalData = signal<any>(null);
  investProfile = signal<any>(null);
  investSummary = signal<any>(null);

  personalComp = viewChild(PersonalDetailsComponent);
  investComp = viewChild(InvestementProfileComponent);

  activeTab = signal('Personal Information');
  isEditing = signal(false);
  profileTabs = ['Personal Information', 'Investment Profile', 'KYC Verification'];

  constructor() {
    effect(() => {
      const client = this.selectedClient();
      if (client) {
        const formattedData = this.formatter.formatProfileData(client);
        if (formattedData) {
          this.clientCard.set(formattedData.cardInfo);
          this.personalData.set(formattedData.personalInfo);
          this.investProfile.set(formattedData.investInfo);
          this.investSummary.set(formattedData.summaryInfo);
        }
      } else {
        this.clientCard.set({});
        this.personalData.set(null);
        this.investProfile.set(null);
        this.investSummary.set(null);
        this.isEditing.set(false);
      }
    }); 
  }

  onTabChange(t: any) { 
    this.activeTab.set(t); 
  }
  
  onEdit() { this.isEditing.set(true); }
  
  onCancel() { 
    this.isEditing.set(false);
    this.personalComp()?.profileForm.patchValue(this.personalData());
    this.investComp()?.investForm.patchValue(this.investProfile());
  }

  onSave() {
    const pComp = this.personalComp();
    const iComp = this.investComp();

    let hasValidationError = false;

    // 1. Check Personal Form and force red borders on empty fields
    if (pComp?.profileForm.invalid) {
      Object.keys(pComp.profileForm.controls).forEach(key => {
        pComp.profileForm.get(key)?.markAsDirty();
        pComp.profileForm.get(key)?.markAsTouched();
      });
      hasValidationError = true;
    }

    // 2. Check Investment Form and force red borders on empty fields
    if (iComp?.investForm.invalid) {
      Object.keys(iComp.investForm.controls).forEach(key => {
        iComp.investForm.get(key)?.markAsDirty();
        iComp.investForm.get(key)?.markAsTouched();
      });
      hasValidationError = true;
    }

    // 3. If any field is missing, stop the save and alert the user
    if (hasValidationError) {
      this.messageService.add({ severity: 'error', summary: 'Missing Information', detail: 'Please fill in all the fields highlighted in red.' });
      return;
    }

    // --- If we pass validation, proceed with saving ---
    const currentClient = this.selectedClient();
    if (!currentClient || !currentClient.clientId) return;

    const pData = pComp?.getFormData() || this.personalData() || {};
    const iData = iComp?.getFormData() || this.investProfile() || {};

    const updatedPayload = {
      ...pData,
      ...iData,
      emailAddress: pData.email, 
      phoneNumber: pData.phone,  
      dateOfBirth: pData.dob,
      investmentGoal: iData.goal, 
      investmentHorizon: iData.horizon,
      liquidityNeeds: iData.liquidity
    };

    this.clientApi.updateClientProfile(currentClient.clientId, updatedPayload).subscribe({
      next: (savedClientFromDB) => {
        this.personalData.set(pData); 
        this.investProfile.set(iData); 
        this.clientState.updateClient(savedClientFromDB); 
        
        this.isEditing.set(false);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Profile saved to Database!' });
      },
      error: (err) => {
        console.error('Save failed:', err);
        if (err.status === 409) {
          this.messageService.add({ severity: 'error', summary: 'Duplicate Email', detail: 'This email is already in use by another client.' });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not save to Database.' });
        }
      }
    });
  }
}