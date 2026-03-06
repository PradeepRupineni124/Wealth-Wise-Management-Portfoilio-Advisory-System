import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { catchError, throwError, EMPTY } from 'rxjs'; // Added EMPTY

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  const isBackendUrl = req.url.includes('ltin656288.cts.com:9090');

  // --- NEW CHANGE START ---
  // If we are on the server and calling the backend, stop the request immediately.
  if (!isBrowser && isBackendUrl) {
    return EMPTY; 
  }
  // --- NEW CHANGE END ---

  const token = isBrowser ? sessionStorage.getItem('token') : null;

  let authReq = req;
  if (token && isBackendUrl) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (isBrowser && [401, 403].includes(error.status)) {
        handleAuthError(router);
      }
      return throwError(() => error);
    })
  );
};

const handleAuthError = (router: Router) => {
  sessionStorage.clear(); 
  router.navigate(['/login'], {
    queryParams: { returnUrl: router.url } 
  });
};