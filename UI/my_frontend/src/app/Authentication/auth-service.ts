import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { PayloadService } from '../services/PayLoadService';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private payloadservice = inject(PayloadService);

  // FIX: Matches your AuthController @RequestMapping("/auth")
  private baseUrl = 'http://ltin656690.cts.com:9090/auth';

  // --- REGISTER ---
  register(userData: any): Observable<string> {
    const payload = this.payloadservice.RegisterPayload(userData);
    return this.http.post(`${this.baseUrl}/register`, payload, { responseType: 'text' });
  }

  // --- LOGIN ---
  login(email: string, password: string): Observable<any> {
    const payload = this.payloadservice.LoginPayload(email, password);

    return this.http.post<any>(`${this.baseUrl}/login`, payload)
      .pipe(
        tap(response => {
          // FIX: Changed from localStorage to sessionStorage
          if (response && response.token) {
            sessionStorage.setItem('token', response.token);
            sessionStorage.setItem('isLoggedIn', 'true');
          }
        })
      );
  }

   // Add this inside your AuthService class
  getCurrentAdvisor(): Observable<any> {
    // Make sure the URL matches your backend configuration
    return this.http.get<any>('http://ltin656690.cts.com:9090/auth/me');
  }

  // --- FORGOT PASSWORD FLOW ---
  forgotPassword(email: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email }, { responseType: 'text' });
  }

  verifyOtp(email: string, otp: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/verify-otp`, { email, otp }, { responseType: 'text' });
  }

  resetPassword(email: string, newPassword: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/reset-password`, { email, newPassword }, { responseType: 'text' });
  }

  // --- HELPERS ---
  logout(): void {
    localStorage.clear();   // Wipes ALL Local Storage data completely
    sessionStorage.clear(); // Wipes Session Storage
  }

  isAuthenticated(): boolean {
    // FIX: Must check sessionStorage
    return !!sessionStorage.getItem('token');
  }
}