import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap, EMPTY } from 'rxjs';
import { PayloadService } from '../services/PayLoadService';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private payloadservice = inject(PayloadService);
  private platformId = inject(PLATFORM_ID);

  private baseUrl = 'http://ltin656690.cts.com:9090/auth';

  // NEW: Holds the email across the Forgot Password -> OTP -> Reset flow
  recoveryEmail = signal<string | null>(null);

  register(userData: any): Observable<string> {
    const payload = this.payloadservice.RegisterPayload(userData);
    return this.http.post(`${this.baseUrl}/register`, payload, { responseType: 'text' });
  }

  login(email: string, password: string): Observable<any> {
    const payload = this.payloadservice.LoginPayload(email, password);
    return this.http.post<any>(`${this.baseUrl}/login`, payload)
      .pipe(
        tap(response => {
          if (isPlatformBrowser(this.platformId)) {
            if (response && response.token) {
              sessionStorage.setItem('token', response.token);
              sessionStorage.setItem('isLoggedIn', 'true');
            }
          }
        })
      );
  }

  getCurrentAdvisor(): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return EMPTY;
    }
    return this.http.get<any>(`${this.baseUrl}/me`);
  }

  // --- Real API Calls for Forgot Password Flow ---

  forgotPassword(email: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email }, { responseType: 'text' });
  }

  verifyOtp(email: string, otp: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/verify-otp`, { email, otp }, { responseType: 'text' });
  }

  resetPassword(email: string, newPassword: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/reset-password`, { email, newPassword }, { responseType: 'text' });
  }

  // --- Utility Methods ---

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
      sessionStorage.clear();
      this.recoveryEmail.set(null); // Clear stored email
    }
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = sessionStorage.getItem('token');
      return !!token;
    }
    return false;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem('token');
    }
    return null;
  }
}