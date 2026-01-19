import { Component, OnInit, ViewChild,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { MenubarModule } from 'primeng/menubar';
import { SelectModule } from 'primeng/select';
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
    MenubarModule, SelectModule, ButtonModule, AvatarModule, TooltipModule,
    SidebarComponent, ClientRegistrationComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {

  @ViewChild(ClientRegistrationComponent) registrationModal!: ClientRegistrationComponent;

  
  private allocationService= inject(AllocationService);
  clients = [
    { name: 'Ganesh', id: 1 },
    { name: 'Harshith', id: 2 },
    { name: 'Kiran', id: 3 },
    { name: 'Nithin', id: 4 },
    { name: 'Pradeep', id: 5 },
    { name: 'Venu', id: 6 }
  ];

  selectedClient: any;

  constructor(private router: Router, private clientState: ClientState,private clientService:ClientDataService, private overviewService: OverviewService) {}

  ngOnInit() {
    
    this.selectedClient = this.clients[0];
    this.clientState.updateClient(this.selectedClient);
    this.clientService.updateClient(this.selectedClient.id);
    this.allocationService.updateClient(this.selectedClient.id);
    this.overviewService.changeClient(this.selectedClient);

  }

  onClientChange(event: any) {
    
    console.log("User changed to:", event.value);
    this.clientState.updateClient(event.value);
    this.clientService.updateClient(event.value.id);
    this.allocationService.updateClient(event.value.id);
    this.overviewService.changeClient(event.value);
  }

  onAddClient() {
    this.registrationModal.showDialog();
  }

  handleNewClient(newClientData: any) {

    console.log('Received from modal:', newClientData);

    const newClient = { 
        name: newClientData.fullName, 
        id: Math.floor(Math.random() * 100000) 
    };
    this.clients = [...this.clients, newClient];

   
    this.selectedClient = newClient;

    
    this.clientState.updateClient(newClient);
    this.clientService.updateClient(newClient.id);

    
    this.allocationService.addClient(newClient.id, newClient.name);
    this.overviewService.changeClient(newClient);
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
 