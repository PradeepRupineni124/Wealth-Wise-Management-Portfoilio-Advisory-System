import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Authentication/auth-service';

export const recoveryGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if we have an email stored in the signal
  if (authService.recoveryEmail()) {
    return true; // Allow access
  } else {
    // No email? Kick them back to the start
    router.navigate(['/forgot-password']);
    return false;
  }
};