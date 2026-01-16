import { Component, OnInit, ViewChild,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

// PrimeNG Imports
import { MenubarModule } from 'primeng/menubar';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';

// Your Components (Check paths!)
import { SidebarComponent } from '../DashBoard/sidebar.component/sidebar.component';
import { ClientRegistrationComponent } from '../client-registration.component/client-registration.component';
import { ClientState } from '../client-state';
import { ClientDataService } from '../DashBoard/Portfolio/client-data.service';
import { AllocationService } from '../allocation.service';
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

  // New Names List
  private allocationService= inject(AllocationService);
  clients = [
    { name: 'Pradeep', id: 1 },
    { name: 'Venu', id: 2 },
    { name: 'Nithin', id: 3 },
    { name: 'Harshit', id: 4 },
    { name: 'Kiran', id: 5 },
    { name: 'Ganesh', id: 6 }
  ];

  selectedClient: any;

  constructor(private router: Router, private clientState: ClientState,private clientService:ClientDataService) {}

  ngOnInit() {
    // Initialize with Pradeep
    this.selectedClient = this.clients[0];
    this.clientState.updateClient(this.selectedClient);
    this.clientService.updateClient(this.selectedClient.id);
    this.allocationService.updateClient(this.selectedClient.id);
  }

  onClientChange(event: any) {
    // When dropdown changes, update the service
    console.log("User changed to:", event.value);
    this.clientState.updateClient(event.value);
    this.clientService.updateClient(event.value.id);
    this.allocationService.updateClient(event.value.id);
  }

  onAddClient() {
    this.registrationModal.showDialog();
  }

  handleNewClient(newClientData: any) {
    const newClient = { 
        name: newClientData.fullName, 
        id: Math.floor(Math.random() * 100000) // Ensure ID is unique/large enough not to clash
    };
    this.clients = [...this.clients, newClient];

    // 3. Select the new client
    this.selectedClient = newClient;

    // 4. Update Legacy Services
    this.clientState.updateClient(newClient);
    this.clientService.updateClient(newClient.id);

    // 5. IMPORTANT: Call 'addClient' on AllocationService so it generates data
    this.allocationService.addClient(newClient.id, newClient.name);
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
 