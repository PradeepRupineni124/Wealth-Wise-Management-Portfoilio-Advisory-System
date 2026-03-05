import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  // Pointing to your API Gateway!
  private baseUrl = 'http://ltin656690.cts.com:9090/api';

  constructor(private http: HttpClient) {}

  // 1. Checks if portfolio exists. If 404, creates it automatically!
  loadOrCreatePortfolio(clientId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/portfolio/${clientId}/summary`).pipe(
      catchError(error => {
        if (error.status === 404) {
          console.log("Portfolio not found. Auto-creating...");
          return this.http.post(`${this.baseUrl}/portfolio`, { clientId }).pipe(
            switchMap(() => this.http.get(`${this.baseUrl}/portfolio/${clientId}/summary`))
          );
        }
        return throwError(() => error);
      })
    );
  }

  // 2. Fetches holdings for the AG Grid
  getHoldings(portfolioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/portfolio/${portfolioId}/holdings`);
  }

  // 3. Fetches the 40 assets for the Smart Form Typeahead
  getAllAssets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/assets`);
  }

  // 4. Submits the new trade
  addInvestment(portfolioId: number, payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/portfolio/${portfolioId}/holdings`, payload, { responseType: 'text' });
  }

  // Add this to your frontend portfolio.service.ts if it isn't there already
  updateHolding(holdingId: number, payload: any) {
    return this.http.put(`${this.baseUrl}/holdings/${holdingId}`, payload, { responseType: 'text' });
  }
}