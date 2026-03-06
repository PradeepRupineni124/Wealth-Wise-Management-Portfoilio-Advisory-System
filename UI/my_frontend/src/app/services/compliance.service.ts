import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

/** * Interface definitions stay the same to ensure type safety 
 */
export interface ComplianceAuditLog {
  id: number;
  clientId: number;
  reviewType: string;
  regulation: string;
  status: boolean; // Backend: true = Compliant, false = Action Required
  findings: string;
  reviewDate: string;
  nextReview: string;
}

@Injectable({
  providedIn: 'root'
})
export class ComplianceService {

  // Hardcoded Gateway URL as per your preference
  private gatewayUrl = 'http://ltin656288.cts.com:9090/api/compliance';

  // State management
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * GET: Compliance Summary for the dashboard cards
   * URL: http://ltin656288.cts.com:9090/api/compliance/summary/{clientId}
   */
  getComplianceSummary(clientId: number): Observable<any> {
    this.loadingSubject.next(true);
    return this.http.get<any>(`${this.gatewayUrl}/summary/${clientId}`).pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError(err => this.handleError(err))
    );
  }

  /**
   * GET: Audit Logs for the PrimeNG Table
   * URL: http://ltin656288.cts.com:9090/api/compliance/audit-logs/client/{clientId}
   */
  getAuditLogs(clientId: number): Observable<ComplianceAuditLog[]> {
    this.loadingSubject.next(true);
    return this.http.get<ComplianceAuditLog[]>(`${this.gatewayUrl}/audit-logs/client/${clientId}`).pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError(err => this.handleError(err))
    );
  }

  /**
   * GET: Risk Metrics for the progress bars
   * URL: http://ltin656288.cts.com:9090/api/compliance/risk-metrics/{clientId}
   */
  getRiskMetrics(clientId: number): Observable<any> {
    this.loadingSubject.next(true);
    return this.http.get<any>(`${this.gatewayUrl}/risk-metrics/${clientId}`).pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError(err => this.handleError(err))
    );
  }

  /**
   * POST: Run a manual audit for a client
   */
  runManualAudit(clientId: number): Observable<ComplianceAuditLog> {
    return this.http.post<ComplianceAuditLog>(`${this.gatewayUrl}/run-audit/${clientId}`, {}).pipe(
      catchError(err => this.handleError(err))
    );
  }

  /**
   * Simple Error Handler
   */
  private handleError(error: any) {
    this.loadingSubject.next(false);
    console.error('[ComplianceService] API Error:', error);
    return throwError(() => new Error(error.message || 'Server Error'));
  }

  // Add this inside src/app/services/compliance.service.ts

  getPortfolioIdByClientId(clientId: number): Observable<number> {
    // Note: Adjust the URL path if your portfolio microservice uses a different endpoint format
    return this.http.get<number>(`http://ltin656288.cts.com:9090/api/portfolio/${clientId}/id`);
  }
}