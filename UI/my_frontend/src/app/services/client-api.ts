import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientApi {
  // 📍 THIS IS THE ONLY PLACE YOUR BACKEND URL LIVES
  private baseUrl = 'http://ltin656932.cts.com:9090/api/clients'; 

  constructor(private http: HttpClient) {}

  // ==========================================
  // 1. FETCHING DATA
  // ==========================================
  
  // Called by LayoutComponent when the app starts
  getAllClients(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // Called to securely view a PDF/Image that is already saved
  getKycDocument(clientId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${clientId}/kyc-document`, { responseType: 'blob' });
  }

  // ==========================================
  // 2. SAVING / UPDATING DATA
  // ==========================================
  
  // Called when creating a brand new client in the sidebar
  createClient(clientData: any, kycFile?: File): Observable<any> {
    const formData = new FormData();
    formData.append('client', new Blob([JSON.stringify(clientData)], { type: 'application/json' }));
    if (kycFile) formData.append('file', kycFile);
    return this.http.post<any>(this.baseUrl, formData);
  }

  // Called when clicking "Save Changes" on the Profile page
  updateClientProfile(clientId: number, clientData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${clientId}`, clientData);
  }

  // Called when clicking "Save Document" in the KYC tab
  uploadKycDocument(clientId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.baseUrl}/${clientId}/kyc`, formData);
  }

  // Called automatically by our 60-second timer to verify documents
  updateKycStatus(clientId: number, status: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${clientId}/kyc-status?status=${status}`, {});
  }
}