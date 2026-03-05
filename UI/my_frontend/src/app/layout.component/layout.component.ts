import { Component, OnInit, ViewChild, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

// PrimeNG UI Elements
import { MenubarModule } from 'primeng/menubar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';

// Child Components & Services
import { SidebarComponent } from '../DashBoard/sidebar.component/sidebar.component';
import { ClientRegistrationComponent } from '../client-registration.component/client-registration.component';
import { ClientState } from '../services/client-state';
import { ClientDataService } from '../DashBoard/Portfolio/client-data.service';
import { AllocationService } from '../services/allocation.service';
import { OverviewService } from '../services/overview.service';
import { AuthService } from '../Authentication/auth-service';
import { ClientApi } from '../services/client-api';

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

  // Connects to the Add Client popup in the HTML
  @ViewChild('registrationModal') registrationModal!: ClientRegistrationComponent;

  // ==========================================
  // 1. INJECTIONS (Tools we need)
  // ==========================================
  private allocationService = inject(AllocationService);
  private authService = inject(AuthService);
  private clientApiService = inject(ClientApi); 
  
  // ==========================================
  // 2. DATA STATE (Variables for the UI)
  // ==========================================
  
  // Lists for the Search Bar
  clients: any[] = []; 
  filteredClients: any[] = []; 
  
  // Currently Selected Data
  selectedClient: any = null;
  searchQuery: any = null; 
  clientName = signal<string>('');
  advisorName: string = 'Loading...';

  constructor(
    private router: Router, 
    private clientState: ClientState, 
    private clientService: ClientDataService, 
    private overviewService: OverviewService,
    private cdr: ChangeDetectorRef
  ) {}

  // ==========================================
  // 3. INITIALIZATION (Runs when app opens)
  // ==========================================
  ngOnInit() {
    this.loadAdvisorDetails();
    this.loadClients();
  }

  // Gets the logged-in Advisor's name from the JWT Token backend
  loadAdvisorDetails() {
    this.authService.getCurrentAdvisor().subscribe({
      next: (res: any) => {
        this.advisorName = res.fullName || 'Advisor'; 
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Failed to load advisor details', err);
        this.advisorName = 'Advisor'; 
        this.cdr.detectChanges();
      }
    });
  }

  // Fetches EVERY client from Spring Boot to populate the search bar
  loadClients() {
    this.clientApiService.getAllClients().subscribe({
      next: (data) => {
        // setTimeout prevents Angular rendering glitches (NG0100)
        setTimeout(() => {
          
          // Hack to make PrimeNG AutoComplete show the name instead of "[object Object]"
          this.clients = data.map(client => {
            client.toString = function() { return this.fullName; };
            return client;
          });

          this.filteredClients = [...this.clients];
          
          // Auto-select the very first client in the list so the screen isn't blank
          if (this.clients.length > 0) {
            this.setSelectedClient(this.clients[0]);
          }
          
          this.cdr.detectChanges(); 
        }, 0);
      },
      error: (err) => console.error('Failed to load clients', err)
    });
  }

  // ==========================================
  // 4. SEARCH BAR LOGIC
  // ==========================================
  
  // Filters the dropdown list as the user types
  filterClients(event: any) {
    let query = event.query;
    if (typeof query === 'object' && query !== null) {
      query = query.fullName || ''; 
    }
    this.filteredClients = this.clients.filter(client => 
      client.fullName?.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Runs when a user clicks a name in the search dropdown
  onClientSelect(event: any) {
    this.setSelectedClient(event.value);
  }

  // ==========================================
  // 5. THE BROADCASTER (Sending data to children)
  // ==========================================
  
  // Updates local variables AND tells all child components that the client changed
  setSelectedClient(client: any) {
    if (!client) return;
    
    // Update top nav bar UI
    this.selectedClient = client;
    this.searchQuery = client; 
    this.clientName.set(client.fullName);
    
    // Broadcast the new data to the rest of the app!
    this.clientState.updateClient(client);             // Updates Profile Component
    this.clientService.updateClient(client.clientId);  // Updates Portfolio Chart
    this.allocationService.updateClient(client.clientId); // Updates Allocation Chart
    this.overviewService.changeClient(client);         // Updates Overview Dashboard
  }

  // ==========================================
  // 6. ADDING A NEW CLIENT
  // ==========================================
  
  // Opens the popup modal
  onAddClient() {
    this.registrationModal.showDialog();
  }

  // Receives the form data from the popup modal and sends it to Spring Boot
  handleNewClient(newClientData: any) {
    const kycFile = newClientData.kycDocument;
    
    // Map the UI form fields to the exact variable names Spring Boot expects
    const clientPayload = { 
        fullName: newClientData.fullName,
        emailAddress: newClientData.email,
        phoneNumber: newClientData.phone,
        address: newClientData.address,
        occupation: newClientData.occupation,
        employer: newClientData.employer,
        investmentAmount: newClientData.investmentAmount,
        riskProfile: newClientData.riskProfile,
        investmentGoal: newClientData.goal,
        investmentHorizon: newClientData.investmentHorizon,
        liquidityNeeds: newClientData.liquidityNeeds,
        kycStatus: newClientData.kycStatus
    };
    
    this.clientApiService.createClient(clientPayload, kycFile).subscribe({
      next: (savedClient) => {
        savedClient.toString = function() { return this.fullName; };
        
        // Add new client to the search bar lists
        this.clients = [...this.clients, savedClient];
        this.filteredClients = [...this.clients];
        
        // Auto-select the client we just created!
        this.setSelectedClient(savedClient);
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Error creating client:', err)
    });
  }

  // ==========================================
  // 7. AUTHENTICATION
  // ==========================================
  logout() {
    this.authService.logout();
    window.location.href = '/login'; 
  }
}