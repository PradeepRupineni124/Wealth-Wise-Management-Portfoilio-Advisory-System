import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap, EMPTY } from 'rxjs'; // Added EMPTY
import { PayloadService } from '../services/PayLoadService';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private payloadservice = inject(PayloadService);
  private platformId = inject(PLATFORM_ID);

  private baseUrl = 'http://ltin656932.cts.com:9090/auth';

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

  // --- NEW CHANGE START ---
  getCurrentAdvisor(): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return EMPTY; // Return nothing if on server
    }
    return this.http.get<any>(`${this.baseUrl}/me`);
  }
  // --- NEW CHANGE END ---

  forgotPassword(email: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email }, { responseType: 'text' });
  }

  verifyOtp(email: string, otp: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/verify-otp`, { email, otp }, { responseType: 'text' });
  }

  resetPassword(email: string, newPassword: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/reset-password`, { email, newPassword }, { responseType: 'text' });
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
      sessionStorage.clear();
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