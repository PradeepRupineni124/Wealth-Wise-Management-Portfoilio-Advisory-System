import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
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
import { MockDataService } from '../../../mock-data.service';

@Component({
  selector: 'app-security-settings',
  standalone: true,
  imports: [
    CommonModule, FileUploadModule, ButtonModule, ToastModule, 
    TagModule, DialogModule, SkeletonModule, TooltipModule
  ],
  providers: [MessageService],
  templateUrl: './security-settings.component.html',
  styleUrl: './security-settings.component.css'
})
export class SecuritySettingsComponent implements OnChanges {
  
  @Input() client: any;
  @Input() isEditMode: boolean = false; 
  @Output() requestEdit = new EventEmitter<void>();

  private dataService = inject(MockDataService);
  private messageService = inject(MessageService);
  private sanitizer = inject(DomSanitizer);

  loading = false;
  
  kycData: any = null;
  backupKycData: any = null;
  
  pendingFile: File | null = null;
  previewUrl: any = null; 
  
  displayViewer = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['client'] && this.client) {
      this.loadKycStatus();
      this.clearPendingState();
    }
    
    if (changes['isEditMode']) {
      if (!this.isEditMode) {
        this.clearPendingState();
        if (this.backupKycData) {
          this.kycData = this.backupKycData;
          this.backupKycData = null;
        }
      }
    }
  }

  loadKycStatus() {
    this.loading = true;
    this.kycData = null; 
    this.backupKycData = null;

    this.dataService.getKycData(this.client).subscribe({
      next: (data: any) => {
        this.kycData = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load KYC status' });
      }
    });
  }

  // --- PREVIEW LOGIC ---

  get isPdf(): boolean {
    if (this.pendingFile) return this.pendingFile.type === 'application/pdf';
    if (this.kycData) return this.kycData.fileType === 'application/pdf';
    return false;
  }

  get viewerUrl(): SafeResourceUrl | string | null {
    if (this.pendingFile && this.previewUrl) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.previewUrl);
    }
    
    if (this.kycData && this.kycData.url && typeof this.kycData.url === 'string' && this.kycData.url.startsWith('data:')) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.kycData.url);
    }

    return null; 
  }
  
  // --- ACTIONS ---

  onAddDocument() { this.requestEdit.emit(); }

  onChangeDocument() {
    this.backupKycData = this.kycData;
    this.kycData = null; 
  }

  onFileSelect(event: any) {
    const file = event.files[0];
    this.pendingFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewUrl = e.target?.result;
    };
    reader.readAsDataURL(file);

    this.messageService.add({ severity: 'info', summary: 'File Selected', detail: 'Click Save Changes to upload.' });
  }

  onRemovePending() {
    this.clearPendingState();
    if (this.backupKycData) {
      this.kycData = this.backupKycData;
      this.backupKycData = null;
    }
  }

  commitSave(): Observable<boolean> {
    if (!this.pendingFile) return of(true); 

    return this.dataService.uploadKycDoc(this.pendingFile).pipe(
      map((response: any) => {
        if (response.success) {
           this.kycData = {
             fileName: this.pendingFile?.name,
             fileType: this.pendingFile?.type,
             uploadDate: new Date().toISOString().split('T')[0],
             
             // *** FIXED HERE: STATUS IS NOW VERIFIED ON UPLOAD ***
             status: 'VERIFIED', 
             
             url: this.previewUrl 
           };
           this.clearPendingState();
           this.backupKycData = null; 
           return true;
        }
        return false;
      })
    );
  }

  clearPendingState() {
    this.pendingFile = null;
    this.previewUrl = null;
  }

  onViewDocument() { this.displayViewer = true; }

  get displayStatus(): string {
    if (this.pendingFile) return 'Ready to Upload';
    if (this.kycData) return this.kycData.status;
    return 'NOT SUBMITTED';
  }

  get severity(): "success" | "warn" | "danger" | "info" | undefined {
    if (this.pendingFile) return 'info';
    if (!this.kycData) return 'warn';
    switch (this.kycData.status) {
      case 'VERIFIED': return 'success'; // Green
      case 'PENDING': return 'warn';     // Yellow
      case 'REJECTED': return 'danger';  // Red
      default: return 'info';
    }
  }
}