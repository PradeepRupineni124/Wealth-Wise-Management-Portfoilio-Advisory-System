import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Authentication/auth-service';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // --- NEW CHANGE START ---
  // Allow server to pass so it can render the basic page layout.
  // The Interceptor will handle blocking the actual data calls.
  if (isPlatformServer(platformId)) {
    return true;
  }
  // --- NEW CHANGE END ---

  if (isPlatformBrowser(platformId)) {
    if (authService.isAuthenticated()) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
  }

  return false;
};