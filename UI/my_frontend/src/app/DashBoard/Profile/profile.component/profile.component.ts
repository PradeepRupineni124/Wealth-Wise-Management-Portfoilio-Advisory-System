import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';

// --- ADD THESE IMPORTS ---
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { ClientState } from '../../../client-state';       
import { MockDataService } from '../../../mock-data.service'; 

import { TabFilterComponent } from '../../../shareable-components/tab-filter.component/tab-filter.component';
import { PersonalDetailsComponent } from '../personal-details.component/personal-details.component';
import { ClientCardComponent } from "../client-card.component/client-card.component";
import { InvestementProfileComponent } from '../investement-profile.component/investement-profile.component';
import { SecuritySettingsComponent } from "../security-settings.component/security-settings.component";

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
    SecuritySettingsComponent
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

  personalComp = viewChild(PersonalDetailsComponent);
  investComp = viewChild(InvestementProfileComponent);

  activeTab = signal('Personal Information');
  isEditing = signal(false);
  profileTabs = ['Personal Information', 'Investment Profile', 'Security & Privacy'];

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
    this.personalComp()?.profileForm.patchValue(this.personalData());
    this.investComp()?.investForm.patchValue(this.investProfile());
  }

  onSave() {
    const pComp = this.personalComp();
    const iComp = this.investComp();

    if (pComp?.profileForm.invalid || iComp?.investForm.invalid) {
      
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Validation Error', 
        detail: 'Please fix the errors highlighted in the form.' 
      });
      return;
    }

    if (pComp) this.personalData.set(pComp.getFormData());
    if (iComp) this.investProfile.set(iComp.getFormData());

    this.isEditing.set(false);
    
    
    this.messageService.add({ 
      severity: 'success', 
      summary: 'Success', 
      detail: 'Profile updated successfully!' 
    });
  }
}