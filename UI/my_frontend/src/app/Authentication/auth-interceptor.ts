import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token'); // Matching the key used in your Service
  
  // LOGIC FIX: Changed to match your actual Backend URL
  // We check if the request is going to your Spring Boot app
  const isBackendUrl = req.url.includes('localhost:8080');

  console.log('Interceptor triggered for URL:', req.url);

  let authReq = req;

  // Only attach the token if it exists AND it's going to your Backend
  if (token && isBackendUrl) {
    console.log('Token found, attaching to request...');
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } else {
    console.warn('No token found or external URL! Sending request without auth.');
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401: Token expired or invalid
      // 403: User lacks permissions
      if ([401, 403].includes(error.status)) {
        handleAuthError(router);
      }
      
      return throwError(() => error);
    })
  );
};

// Helper function (Kept exactly as you requested)
const handleAuthError = (router: Router) => {
  localStorage.clear(); // Clear all auth-related items
  router.navigate(['/login'], {
    queryParams: { returnUrl: router.url } 
  });
};