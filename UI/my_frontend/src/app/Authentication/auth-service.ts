import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { PayloadService } from '../services/PayLoadService';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private payloadservice = inject(PayloadService)
  
  // FIX: Matches your AuthController @RequestMapping("/auth")
  private baseUrl = 'http://ltin656932.cts.com:9090/auth'; 

  // --- REGISTER ---
  register(userData: any): Observable<string> {
    // FIX: Your backend returns a String ("User registered successfully"), not JSON.
    // We must use { responseType: 'text' } or Angular will throw a parsing error.
    const payload = this.payloadservice.RegisterPayload(userData);

    return this.http.post(`${this.baseUrl}/register`, payload, { responseType: 'text' });
  }

  // --- LOGIN ---
  login(email: string, password: string): Observable<any> {
    // FIX: Your LoginRequest.java expects 'email', not 'username'.
    const payload = this.payloadservice.LoginPayload(email, password);

    return this.http.post<any>(`${this.baseUrl}/login`, payload)
      .pipe(
        tap(response => {
          // Logic kept same: Automatically save token on success
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('isLoggedIn', 'true');
          }
        })
      );
  }

  // --- FORGOT PASSWORD FLOW (Required for your existing pages) ---
  
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
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    // Optional: this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}