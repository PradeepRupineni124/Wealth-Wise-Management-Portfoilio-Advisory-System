import { Component, OnInit, ViewChild } from '@angular/core';
import { SidebarComponent } from '../DashBoard/sidebar.component/sidebar.component';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { MenubarModule } from 'primeng/menubar';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'primeng/api';
import { ClientRegistrationComponent } from '../client-registration.component/client-registration.component';

import { OverviewService } from '../services/overview.service';


@Component({
  selector: 'app-layout.component',
   standalone: true,
    imports: [
      ClientRegistrationComponent,
      CommonModule,
      FormsModule,
      RouterModule,
      MenubarModule,
      BadgeModule,
      AvatarModule,
      ButtonModule,
      RippleModule,
      TooltipModule,
      SelectModule,
      SidebarComponent,
      SharedModule
    ],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.css',
  })
  export class LayoutComponent implements OnInit {
    
    // 2. Access the Child Component from TypeScript
    @ViewChild(ClientRegistrationComponent) registrationModal!: ClientRegistrationComponent;
  
    // Define Client Data (Using ID as number consistently)
    clients = [
      { name: 'Ganesh', id: 1 },
      { name: 'Harshith', id: 2 },
      { name: 'Kiran', id: 3 },
      { name: 'Nithin', id: 4 },
      { name: 'Pradeep', id: 5 },
      { name: 'Venu', id: 6 }
    ];
  
    selectedClient: any;
  
    constructor(private router: Router, private overviewService: OverviewService) {}
  
    ngOnInit() {
      this.selectedClient = this.clients[0];
      // Ensure service starts with default
    this.overviewService.changeClient(this.selectedClient);
    }
  
    onClientChange(event: any) {
      console.log("Switched to:", event.value);
      // Notify the service that the client changed
    this.overviewService.changeClient(event.value);
    }
  
    // 3. This function now works! It opens the modal via ViewChild
    onAddClient() {
      this.registrationModal.showDialog();
    }
  
    // 4. Handle the data coming back from the modal
    handleNewClient(newClientData: any) {
      console.log('Received from modal:', newClientData);
      
      // Create new object (Generate a random Number ID to match existing data)
      const newClient = { 
          name: newClientData.fullName, 
          id: Math.floor(Math.random() * 10000) 
      };
  
      // Add to list
      this.clients = [...this.clients, newClient];
  
      // UX Improvement: Auto-select the newly created client
      this.selectedClient = newClient;

      // Also update the dashboard immediately for the new user
     this.overviewService.changeClient(newClient);
    }
  
    logout() {
      localStorage.removeItem('token');
      sessionStorage.clear();
      this.router.navigate(['/login']);
    }
  }