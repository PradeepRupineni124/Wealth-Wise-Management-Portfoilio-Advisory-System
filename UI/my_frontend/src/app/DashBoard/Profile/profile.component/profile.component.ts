import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';

// SERVICES
import { ClientState } from '../../../client-state';       // 1. Knows WHO is selected
import { MockDataService } from '../../../mock-data.service'; // 2. Knows the DATA (Import this)

// COMPONENTS
import { TabFilterComponent } from '../../../shareable-components/tab-filter.component/tab-filter.component';
import { PersonalDetailsComponent } from '../personal-details.component/personal-details.component';
import { ClientCardComponent } from "../client-card.component/client-card.component";
import { InvestementProfileComponent } from '../investement-profile.component/investement-profile.component';
import { SecuritySettingsComponent } from "../security-settings.component/security-settings.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, ButtonModule, ClientCardComponent, TabFilterComponent, 
    PersonalDetailsComponent, InvestementProfileComponent, SecuritySettingsComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  
  // --- INJECT SERVICES ---
  private clientState = inject(ClientState);
  private dataService = inject(MockDataService); // <--- Inject the new service

  // --- SIGNALS ---
  // This signal listens to your Layout dropdown automatically
  selectedClient = toSignal(this.clientState.currentClient$);

  // Data Signals
  clientCard = signal<any>({});
  personalData = signal<any>(null);
  investProfile = signal<any>(null);
  investSummary = signal<any>(null);

  // View Children (for Saving)
  personalComp = viewChild(PersonalDetailsComponent);
  investComp = viewChild(InvestementProfileComponent);

  // UI State
  activeTab = signal('Personal Information');
  isEditing = signal(false);
  profileTabs = ['Personal Information', 'Investment Profile', 'Security & Privacy'];

  constructor() {
    // --- THE TRIGGER ---
    // This runs automatically whenever 'selectedClient' changes
    effect(() => {
      const client = this.selectedClient();

      if (client) {
        console.log("Client changed to:", client.name, "- Fetching new data...");

        // Call our Mock Service
        this.dataService.getProfileData(client).subscribe(data => {
          
          // Update the UI with the new data
          this.clientCard.set(data.cardInfo);
          this.personalData.set(data.personalInfo);
          this.investProfile.set(data.investInfo);
          this.investSummary.set(data.summaryInfo);
          
        });
      }
    });
  }

  // --- ACTIONS (Keep these exactly the same) ---
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
      alert("Please fix errors.");
      return;
    }

    if (pComp) this.personalData.set(pComp.getFormData());
    if (iComp) this.investProfile.set(iComp.getFormData());

    this.isEditing.set(false);
    alert("Saved!");
  }
}