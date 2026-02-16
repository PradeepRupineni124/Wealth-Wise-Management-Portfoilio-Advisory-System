import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './Authentication/auth-service'; // Update the path if your file structure is different

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true; // Token exists in this specific tab, allow access
  } else {
    // No token found (or user copied URL to a new tab), kick them to login
    router.navigate(['/login']);
    return false; 
  }
};