import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { MenubarModule } from 'primeng/menubar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';

import { SidebarComponent } from '../DashBoard/sidebar.component/sidebar.component';
import { ClientRegistrationComponent } from '../client-registration.component/client-registration.component';
import { ClientState } from '../client-state';
import { ClientDataService } from '../DashBoard/Portfolio/client-data.service';
import { AllocationService } from '../allocation.service';
import { OverviewService } from '../services/overview.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MenubarModule, AutoCompleteModule, ButtonModule, AvatarModule, TooltipModule,
    SidebarComponent, ClientRegistrationComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {

  @ViewChild(ClientRegistrationComponent) registrationModal!: ClientRegistrationComponent;

  private allocationService = inject(AllocationService);
  
  clients: any[] = [
    { name: 'Ganesh', id: 1 },
    { name: 'Harshith', id: 2 },
    { name: 'Kiran', id: 3 },
    { name: 'Nithin', id: 4 },
    { name: 'Pradeep', id: 5 },
    { name: 'Venu', id: 6 }
  ];

  // Logic Variable: Object
  selectedClient: any;
  // Display Variable: Should be Object (since field="name" is used in HTML)
  searchQuery: any; 
  
  filteredClients: any[] = []; 
  clientName = signal<string>('');

  constructor(
    private router: Router, 
    private clientState: ClientState, 
    private clientService: ClientDataService, 
    private overviewService: OverviewService
  ) {}

  ngOnInit() {
    this.filteredClients = [...this.clients];
    
    // Initialize first client
    const initialClient = this.clients[0];
    this.selectedClient = initialClient;

    // FIX: Set searchQuery to the full Object. 
    // The 'field="name"' in HTML will automatically extract the name for display.
    this.searchQuery = initialClient; 
    
    this.clientName.set(initialClient.name);

    this.updateClientServices(initialClient);
  }

  filterClients(event: any) {
    let query = event.query;

    // Safety: Handle Object case during selection
    if (typeof query === 'object' && query !== null) {
        query = query.name;
    }

    this.filteredClients = this.clients.filter(client => 
      client.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  onClientSelect(event: any) {
    const client = event.value;
    
    this.selectedClient = client;

    this.updateClientServices(client);
  }

  updateClientServices(client: any) {
    this.clientState.updateClient(client);
    this.clientService.updateClient(client.id);
    this.allocationService.updateClient(client.id);
    this.overviewService.changeClient(client);
  }

  onAddClient() {
    this.registrationModal.showDialog();
  }

  handleNewClient(newClientData: any) {
    const newClient = { 
        id: Math.floor(Math.random() * 100000) + 10, 
        name: newClientData.fullName,
        email: newClientData.email,
        kycDoc: newClientData.kycDocument,
        investInfo: {
            riskProfile: newClientData.riskProfile,
            goal: newClientData.goal,
            horizon: newClientData.investmentHorizon,
            liquidity: newClientData.liquidityNeeds
        },
        personalInfo: {
            phone: newClientData.phone,
            address: newClientData.address,
            occupation: newClientData.occupation,
            employer: newClientData.employer
        }
    };
    
    this.clients = [...this.clients, newClient];
    this.selectedClient = newClient;
    
    // FIX: Update with the full Object
    this.searchQuery = newClient; 
    
    this.clientName.set(newClient.name);
    
    this.filteredClients = [...this.clients];
    this.updateClientServices(newClient);
  }

  logout() {
    localStorage.removeItem('token');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
  
  triggerInvestmentPopup() {
    this.clientService.triggerAddInvestment();
  }
}