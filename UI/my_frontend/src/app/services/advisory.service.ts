import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdvisoryService {
  private http = inject(HttpClient);
  
  // Point to the Gateway Port (9090)
  // The path /api/recommendations/ matches the route in GatewayConfig
  private baseUrl = 'http://ltin656601.cts.com:9090/api/recommendations';
  private portfolioBaseUrl = 'http://ltin656601.cts.com:9090/api/portfolio';

  getRecommendations(portfolioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${portfolioId}`);
  }

  generateRecommendation(clientId: number, portfolioId: number): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/generate/${clientId}/${portfolioId}`, {});
  }

  updateRecommendationStatus(recId: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${recId}/status?status=${status}`, {});
  }


  getPortfolioIdByClientId(clientId: number): Observable<number> {
    return this.http.get<number>(`${this.portfolioBaseUrl}/${clientId}/id`);
  }



}