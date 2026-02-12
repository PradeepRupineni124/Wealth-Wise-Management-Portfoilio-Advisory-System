import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { ClientState } from '../../../services/client-state';       
import { MockDataService } from '../../../services/mock-data.service'; 

import { TabFilterComponent } from '../../../shareable-components/tab-filter.component/tab-filter.component';
import { PersonalDetailsComponent } from '../personal-details.component/personal-details.component';
import { ClientCardComponent } from "../client-card.component/client-card.component";
import { InvestementProfileComponent } from '../investement-profile.component/investement-profile.component';
import { SecuritySettingsComponent } from '../security-settings.component/security-settings.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    ButtonModule, 
    ToastModule, 
    ClientCardComponent, 
    TabFilterComponent, 
    PersonalDetailsComponent, 
    InvestementProfileComponent, 
    SecuritySettingsComponent // 2. Add to Imports
  ],
  providers: [MessageService], 
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  
  private clientState = inject(ClientState);
  private dataService = inject(MockDataService);
  private messageService = inject(MessageService); 

  selectedClient = toSignal(this.clientState.currentClient$);

  clientCard = signal<any>({});
  personalData = signal<any>(null);
  investProfile = signal<any>(null);
  investSummary = signal<any>(null);

  // 3. ViewChildren references
  personalComp = viewChild(PersonalDetailsComponent);
  investComp = viewChild(InvestementProfileComponent);
  kycComp = viewChild(SecuritySettingsComponent); // Reference to KYC

  activeTab = signal('Personal Information');
  isEditing = signal(false);
  
  // 4. Update Tab Names
  profileTabs = ['Personal Information', 'Investment Profile', 'KYC Verification'];

  constructor() {
    effect(() => {
      const client = this.selectedClient();
      if (client) {
        this.dataService.getProfileData(client).subscribe(data => {
          this.clientCard.set(data.cardInfo);
          this.personalData.set(data.personalInfo);
          this.investProfile.set(data.investInfo);
          this.investSummary.set(data.summaryInfo);
        });
      }
    });
  }

  onTabChange(t: string) { this.activeTab.set(t); }
  
  onEdit() { this.isEditing.set(true); }
  
  onCancel() { 
    this.isEditing.set(false);
    // Reset forms
    this.personalComp()?.profileForm.patchValue(this.personalData());
    this.investComp()?.investForm.patchValue(this.investProfile());
    // KYC component handles its own pending file reset via OnChanges
  }

  onSave() {
    const pComp = this.personalComp();
    const iComp = this.investComp();
    const kComp = this.kycComp();

    // 1. Validate Forms
    if (pComp?.profileForm.invalid || iComp?.investForm.invalid) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Validation Error', 
        detail: 'Please fix the errors highlighted in the form.' 
      });
      return;
    }

    // 2. Commit Data to signals
    if (pComp) this.personalData.set(pComp.getFormData());
    if (iComp) this.investProfile.set(iComp.getFormData());

    // 3. Handle KYC Upload (The actual "Save" for documents)
    if (kComp) {
      kComp.commitSave().subscribe(success => {
         if (success) {
           // Only show success toast if doc upload worked (or if there was nothing to upload)
           this.finalizeSave();
         } else {
           this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload document' });
         }
      });
    } else {
      this.finalizeSave();
    }
  }

  finalizeSave() {
    this.isEditing.set(false);
    this.messageService.add({ 
      severity: 'success', 
      summary: 'Success', 
      detail: 'Profile and Documents updated successfully!' 
    });
  }
}