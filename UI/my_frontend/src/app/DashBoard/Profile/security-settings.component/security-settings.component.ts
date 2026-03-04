import { Component, Input, inject, OnChanges, SimpleChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// PrimeNG Imports
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';

// Services
import { ClientApi } from '../../../client-api';
import { ClientState } from '../../../services/client-state'; 

@Component({
  selector: 'app-security-settings',
  standalone: true,
  imports: [CommonModule, FileUploadModule, ButtonModule, ToastModule, TagModule, DialogModule, SkeletonModule, TooltipModule],
  providers: [MessageService],
  templateUrl: './security-settings.component.html',
  styleUrl: './security-settings.component.css'
})
export class SecuritySettingsComponent implements OnChanges, OnDestroy {
  
  @Input() client: any; // Receives data from ProfileComponent

  private clientApi = inject(ClientApi);
  private messageService = inject(MessageService);
  private sanitizer = inject(DomSanitizer);
  private clientState = inject(ClientState);
  private cdr = inject(ChangeDetectorRef);

  // --- UI STATES ---
  loading = false;
  isEditingLocal = false; 
  displayViewer = false;
  displayStatus: string = 'NOT SUBMITTED';
  severity: "success" | "warn" | "danger" | "info" | undefined = 'warn';
  isPdf: boolean = false;

  // --- DATA STATES ---
  kycData: any = null;              // Holds existing DB document details
  pendingFile: File | null = null;  // Holds a new file user just selected
  
  // --- MEMORY/URL STATES ---
  securePreviewUrl: SafeResourceUrl | null = null; 
  rawObjectUrl: string | null = null; 
  private verificationTimer: any = null;

  // =========================================================================
  // SECTION 1: COMPONENT SETUP & CLEANUP
  // =========================================================================

  // Runs every time a new client is selected from the top search bar
  // Runs every time a new client is selected from the top search bar
  ngOnChanges(changes: SimpleChanges) {
    if (changes['client'] && this.client) {
      
      if (this.client.kycDocumentRef || this.client.kycStatus !== 'NOT_VERIFIED') {
        this.kycData = {
          fileName: 'Uploaded_Document',
          status: this.client.kycStatus,
          uploadDate: this.client.createdDate ? this.client.createdDate.split('T')[0] : 'N/A'
        };

        // 🚨 THE FIX: Only run the auto-verify timer if a document ACTUALLY exists!
        if (this.kycData.status === 'PENDING') {
          if (this.client.kycDocumentRef) {
            this.simulateVerification(3000); 
          } else {
            this.clearVerificationTimer(); // Don't verify if no document is uploaded
          }
        } else {
          this.clearVerificationTimer();
        }

      } else {
        this.kycData = null; // No document exists
      }
      
      this.clearPendingState();
      this.isEditingLocal = false; 
      this.updateUIStates(); 
    }
  }

  // Prevents memory leaks when the user leaves the page
  ngOnDestroy() {
    this.revokeObjectUrl();
    this.clearVerificationTimer(); 
  }
  
  // =========================================================================
  // SECTION 2: UPLOAD LOGIC
  // =========================================================================

  enableEdit() { this.isEditingLocal = true; }
  
  cancelEdit() {
    this.isEditingLocal = false;
    this.clearPendingState();
    this.updateUIStates();
  }

  // Runs when user drags/drops a file into the PrimeNG box
  onFileSelect(event: any) {
    const file = event.files[0];
    this.pendingFile = file;

    // Generate a temporary secure URL so they can preview it before saving
    this.revokeObjectUrl();
    this.rawObjectUrl = URL.createObjectURL(file);
    this.securePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.rawObjectUrl);
    
    this.updateUIStates(); 
  }

  // Runs when the user clicks "Save Document"
  saveDocument() {
    if (!this.pendingFile || !this.client) return;

    this.loading = true;

    // Call Postman to send file to Spring Boot
    this.clientApi.uploadKycDocument(this.client.clientId, this.pendingFile).subscribe({
      next: (updatedClient) => {
           this.kycData = {
             fileName: this.pendingFile?.name,
             uploadDate: new Date().toISOString().split('T')[0],
             status: updatedClient.kycStatus // Backend returns 'PENDING'
           };
           this.clearPendingState();
           this.isEditingLocal = false; 
           this.updateUIStates(); 
           
           this.clientState.updateClient(updatedClient); // Update "The Brain"

           this.messageService.add({ severity: 'info', summary: 'Under Review', detail: 'Document pending verification.' });
           this.loading = false;
           this.cdr.detectChanges(); 

           // Start the 60-second background timer for new uploads!
           this.simulateVerification(60000);
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Upload Failed', detail: 'Could not upload to server.' });
        this.cdr.detectChanges();
      }
    });
  }

  // =========================================================================
  // SECTION 3: THE AUTO-VERIFICATION TIMER
  // =========================================================================

  private simulateVerification(delayMs: number) {
    this.clearVerificationTimer();
    
    // Set a countdown clock
    this.verificationTimer = setTimeout(() => {
      
      // If time is up, tell Spring Boot to update the DB to 'VERIFIED'
      if (this.kycData && this.kycData.status === 'PENDING' && this.client) {
        this.clientApi.updateKycStatus(this.client.clientId, 'VERIFIED').subscribe({
          next: (updatedClientFromDB) => {
            
            this.kycData.status = updatedClientFromDB.kycStatus;
            this.updateUIStates();
            this.clientState.updateClient(updatedClientFromDB);

            this.messageService.add({ severity: 'success', summary: 'Verification Complete', detail: 'Document verified!' });
            this.cdr.detectChanges(); 
          }
        });
      }
    }, delayMs); 
  }

  private clearVerificationTimer() {
    if (this.verificationTimer) {
      clearTimeout(this.verificationTimer);
      this.verificationTimer = null;
    }
  }

  // =========================================================================
  // SECTION 4: PREVIEW LOGIC & HELPERS
  // =========================================================================

  onViewDocument() { 
    // Scenario A: They are previewing a file they JUST dragged in (No backend needed)
    if (this.pendingFile && this.securePreviewUrl) {
      this.displayViewer = true;
      this.cdr.detectChanges();
      return;
    }

    // Scenario B: They are previewing a file saved in MySQL (Must fetch from Backend)
    if (this.client && this.client.clientId && this.kycData) {
      this.loading = true;
      this.cdr.detectChanges();

      this.clientApi.getKycDocument(this.client.clientId).subscribe({
        next: (blob: Blob) => {
          // Force proper file types so the browser doesn't force a download
          const typedBlob = this.formatSafeBlob(blob);

          this.revokeObjectUrl();
          this.rawObjectUrl = URL.createObjectURL(typedBlob);
          this.securePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.rawObjectUrl);
          
          this.loading = false;
          this.displayViewer = true;
          this.updateUIStates(); 
          this.cdr.detectChanges(); 
        }
      });
    }
  }

  // Helper function to safely format data chunks from the backend
  private formatSafeBlob(blob: Blob): Blob {
    let mimeType = blob.type;
    if (!mimeType || mimeType === 'application/octet-stream') {
      const fileName = this.kycData.fileName?.toLowerCase() || '';
      if (fileName.endsWith('.pdf')) mimeType = 'application/pdf';
      else if (fileName.endsWith('.png')) mimeType = 'image/png';
      else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) mimeType = 'image/jpeg';
      else mimeType = 'application/pdf';
    }
    return new Blob([blob], { type: mimeType });
  }

  // Helpers to clean up UI strings and Memory
  clearPendingState() {
    this.pendingFile = null;
    this.revokeObjectUrl();
    this.updateUIStates();
  }

  private revokeObjectUrl() {
    if (this.rawObjectUrl) {
      URL.revokeObjectURL(this.rawObjectUrl);
      this.rawObjectUrl = null;
      this.securePreviewUrl = null;
    }
  }

  private updateUIStates() {
    this.isPdf = this.pendingFile ? this.pendingFile.type === 'application/pdf' : true; 

    if (this.pendingFile) {
      this.displayStatus = 'Ready to Upload';
      this.severity = 'info';
    } else if (this.kycData) {
      this.displayStatus = this.kycData.status;
      switch (this.kycData.status) {
        case 'VERIFIED': this.severity = 'success'; break;
        case 'PENDING': this.severity = 'warn'; break;
        case 'REJECTED': this.severity = 'danger'; break;
        default: this.severity = 'info';
      }
    } else {
      this.displayStatus = 'NOT SUBMITTED';
      this.severity = 'warn';
    }
  }
}