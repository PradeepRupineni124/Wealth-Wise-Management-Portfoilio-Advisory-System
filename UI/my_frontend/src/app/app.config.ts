import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';
// import { provideAnimations } from '@angular/platform-browser/animations';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideClientHydration(withEventReplay(),),
    // provideAnimations(),
    providePrimeNG({
            theme: {
                preset: Aura,
                options: {
                  // prefix: 'p',
                    darkModeSelector: '.my-app-dark',
                    // cssLayer:false
                }
            }
        }),
        MessageService
  ]
};
