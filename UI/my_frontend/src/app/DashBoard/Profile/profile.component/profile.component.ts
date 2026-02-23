import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Services
import { ClientState } from '../../../services/client-state';       
import { ProfileFormatterService } from '../../../profile-formatter.service'; 
import { ClientApi } from '../../../client-api'; 

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
  
  // 1. INJECTIONS (Tools we need to use)
  private clientState = inject(ClientState);   // "The Brain" (holds current client)
  private clientApi = inject(ClientApi);       // "The Postman" (talks to Spring Boot)
  private formatter = inject(ProfileFormatterService); // "The Translator" (formats data for UI)
  private messageService = inject(MessageService); 

  // 2. STATE VARIABLES (Data for the UI)
  selectedClient = toSignal(this.clientState.currentClient$); // Auto-updates when user searches a new client!
  
  clientCard = signal<any>({});
  personalData = signal<any>(null);
  investProfile = signal<any>(null);
  investSummary = signal<any>(null);

  // Grab references to the child forms so we can read their data later
  personalComp = viewChild(PersonalDetailsComponent);
  investComp = viewChild(InvestementProfileComponent);

  activeTab = signal('Personal Information');
  isEditing = signal(false);
  profileTabs = ['Personal Information', 'Investment Profile', 'KYC Verification'];

  constructor() {
    // 3. LISTEN FOR DATA CHANGES
    // This 'effect' watches the Brain. If a new client is selected, it reformats the data and updates the UI instantly.
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
      }
    });
  }

  // 4. UI INTERACTIONS
  onTabChange(t: string) { this.activeTab.set(t); }
  onEdit() { this.isEditing.set(true); }
  
  onCancel() { 
    this.isEditing.set(false);
    // Reset forms back to original database data
    this.personalComp()?.profileForm.patchValue(this.personalData());
    this.investComp()?.investForm.patchValue(this.investProfile());
  }

  // 5. SAVING TO DATABASE
  onSave() {
    const pComp = this.personalComp();
    const iComp = this.investComp();

    // Prevent saving if forms have errors (like missing emails)
    if (pComp?.profileForm.invalid || iComp?.investForm.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: 'Please fix form errors.' });
      return;
    }

    const currentClient = this.selectedClient();
    if (!currentClient || !currentClient.clientId) return;

    // STEP A: Extract and merge data from both child components safely
    const pData = pComp?.getFormData() || {};
    const iData = iComp?.getFormData() || {};

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

    // STEP B: Tell the Postman to send the data to Spring Boot!
    this.clientApi.updateClientProfile(currentClient.clientId, updatedPayload).subscribe({
      next: (savedClientFromDB) => {
        
        // STEP C: Success! Update our local memory with the fresh Database object
        this.personalData.set(pData); 
        this.investProfile.set(iData); 
        this.clientState.updateClient(savedClientFromDB); // Updates the Brain!
        
        this.isEditing.set(false);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Profile saved to Database!' });
      },
      error: (err) => {
        console.error('Save failed:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not save to Database.' });
      }
    });
  }
}