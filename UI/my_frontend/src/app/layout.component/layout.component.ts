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
import { ClientRegistrationComponent } from '../client-registration.component/client-registration.component';


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
      SidebarComponent
    ],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.css',
  })
  export class LayoutComponent implements OnInit {
    
    // 2. Access the Child Component from TypeScript
    @ViewChild(ClientRegistrationComponent) registrationModal!: ClientRegistrationComponent;
  
    // Define Client Data (Using ID as number consistently)
    clients = [
      { name: 'Karthik A.', id: 1 },
      { name: 'John Doe', id: 2 },
      { name: 'Sarah Smith', id: 3 }
    ];
  
    selectedClient: any;
  
    constructor(private router: Router) {}
  
    ngOnInit() {
      this.selectedClient = this.clients[0];
    }
  
    onClientChange(event: any) {
      console.log("Switched to:", event.value);
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
    }
  
    logout() {
      localStorage.removeItem('token');
      sessionStorage.clear();
      this.router.navigate(['/login']);
    }
  }