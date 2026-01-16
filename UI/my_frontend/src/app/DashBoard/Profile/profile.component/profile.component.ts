import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';

// Components
import { TabFilterComponent } from '../../../shareable-components/tab-filter.component/tab-filter.component';
import { PersonalDetailsComponent } from '../personal-details.component/personal-details.component';
import { ClientCardComponent } from "../client-card.component/client-card.component";
import { InvestementProfileComponent } from '../investement-profile.component/investement-profile.component';
import { SecuritySettingsComponent } from "../security-settings.component/security-settings.component";
import { ClientState } from '../../../client-state';

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
  // --- 1. SETUP ---
  
  // Get the Service
  private clientService = inject(ClientState);

  // Get Child Components (Used for Saving/Canceling)
  // These are signals: access them like this.personalComp()
  personalComp = viewChild(PersonalDetailsComponent);
  investComp = viewChild(InvestementProfileComponent);

  // --- 2. STATE (SIGNALS) ---

  // Current Client from Service (Auto-updates)
  selectedClient = toSignal(this.clientService.currentClient$);

  // Tabs & Editing State
  profileTabs = ['Personal Information', 'Investment Profile', 'Security & Privacy'];
  activeTab = signal('Personal Information');
  isEditing = signal(false);

  // Data to show in UI
  clientCard = signal<any>({});
  personalData = signal<any>(null);
  investProfile = signal<any>(null);
  investSummary = signal<any>(null);

  constructor() {
    // --- 3. SYNC LOGIC ---
    // "Effect" means: Run this code automatically whenever signals change.
    effect(() => {
      const client = this.selectedClient();
      
      // If we have a client, generate their data
      if (client) {
        console.log("Loading data for:", client.name);
        this.generateFakeData(client);
      }
    });
  }

  // --- 4. USER ACTIONS ---

  onTabChange(newTab: string) {
    this.activeTab.set(newTab);
  }

  onEdit() {
    this.isEditing.set(true);
  }

  onCancel() {
    this.isEditing.set(false);
    
    // Reset forms to the original data
    // We use ?. because the component might not be ready yet
    this.personalComp()?.profileForm.patchValue(this.personalData());
    this.investComp()?.investForm.patchValue(this.investProfile());
  }

  onSave() {
    console.log('--- Saving ---');

    // 1. Get the child components
    const personalComponent = this.personalComp();
    const investComponent = this.investComp();

    // 2. Check if Forms are Valid (safe check with ?)
    // If component exists, check validity. If it doesn't exist, assume it's okay.
    const personalValid = personalComponent ? personalComponent.profileForm.valid : true;
    const investValid = investComponent ? investComponent.investForm.valid : true;

    if (!personalValid || !investValid) {
      alert("Please check for errors in the forms.");
      return; // Stop here
    }

    // 3. Get the new values
    const newPersonalData = personalComponent?.getFormData();
    const newInvestData = investComponent?.getFormData();

    // 4. Update our Signals (Save the data)
    if (newPersonalData) this.personalData.set(newPersonalData);
    if (newInvestData) this.investProfile.set(newInvestData);

    // 5. Turn off Edit Mode
    this.isEditing.set(false);
    alert("Saved Successfully!");
  }

  // --- 5. HELPER (Fake Data Generator) ---
  // I moved this down here to keep the main logic clean
  private generateFakeData(c: any) {
    // Set Header Card
    this.clientCard.set({
      name: c.name,
      id: `CL-00${c.id}`,
      risk: c.id % 2 === 0 ? 'Aggressive' : 'Moderate',
      goal: 'Wealth Accumulation',
      verified: true
    });

    // Set Personal Details
    this.personalData.set({
      fullName: c.name,
      email: `${c.name.toLowerCase().replace(' ', '.')}@example.com`,
      phone: `+91 98765 4321${c.id}`,
      dob: new Date('1990-01-15'),
      address: `Flat ${c.id}01, Tech Park, Hyderabad`,
      occupation: 'Software Engineer',
      employer: 'Cognizant'
    });

    // Set Investment Profile (Alternating logic based on ID)
    if (c.id % 2 === 0) {
      this.investProfile.set({ riskProfile: 'Aggressive', goal: 'Wealth', horizon: 'Long', liquidity: 'Medium' });
      this.investSummary.set({ allocation: 'Crypto 20% | Stocks 80%', score: '9.0 / 10', return: '15-20%' });
    } else {
      this.investProfile.set({ riskProfile: 'Moderate', goal: 'Retirement', horizon: 'Medium', liquidity: 'Low' });
      this.investSummary.set({ allocation: 'Equities 45% | Bonds 30% | MF 25%', score: '6.5 / 10', return: '8-12%' });
    }
  }
}