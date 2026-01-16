import { Component, OnInit, ViewChild } from '@angular/core';
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
  clients = [
    { name: 'Pradeep', id: 1 },
    { name: 'Venu', id: 2 },
    { name: 'Nithin', id: 3 },
    { name: 'Harshit', id: 4 },
    { name: 'Kiran', id: 5 },
    { name: 'Ganesh', id: 6 }
  ];

  selectedClient: any;

  constructor(private router: Router, private clientState: ClientState) {}

  ngOnInit() {
    // Initialize with Pradeep
    this.selectedClient = this.clients[0];
    this.clientState.updateClient(this.selectedClient);
  }

  onClientChange(event: any) {
    // When dropdown changes, update the service
    console.log("User changed to:", event.value);
    this.clientState.updateClient(event.value);
  }

  onAddClient() {
    this.registrationModal.showDialog();
  }

  handleNewClient(newClientData: any) {
    const newClient = { 
        name: newClientData.fullName, 
        id: Math.floor(Math.random() * 10000) 
    };
    this.clients = [...this.clients, newClient];
    this.selectedClient = newClient;
    this.clientState.updateClient(newClient);
  }

  logout() {
    localStorage.removeItem('token');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
 