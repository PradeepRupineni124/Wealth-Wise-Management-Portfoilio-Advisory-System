import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';
import { definePreset } from '@primeuix/themes';
import { provideHttpClient, withInterceptors,withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './Authentication/auth-interceptor'; // Import your file


const WealthWisePreset = definePreset(Aura, {
    semantic: {
        // 1. PRIMARY: Emerald (Wealth/Growth Green)
        primary: {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981',
            600: '#059669', // <--- MAIN BRAND COLOR
            700: '#047857',
            800: '#065f46',
            900: '#064e3b',
            950: '#022c22'
        },

        // 2. SURFACE: Teal (Sophisticated Blue-Green foundation)
        surface: {
            0: '#ffffff',
            50: '#f0fdfa',
            100: '#ccfbf1',
            200: '#99f6e4',
            300: '#5eead4',
            400: '#2dd4bf',
            500: '#14b8a6',
            600: '#0d9488',
            700: '#0f766e',
            800: '#115e59',
            900: '#134e4a',
            950: '#042f2e'
        },

        // 3. NEW: GRAY (Neutral/Zinc - Essential since Surface is now Teal)
        gray: {
            50: '#fafafa',
            100: '#f4f4f5',
            200: '#e4e4e7',
            300: '#d4d4d8',
            400: '#a1a1aa',
            500: '#71717a',
            600: '#52525b',
            700: '#3f3f46',
            800: '#27272a',
            900: '#18181b',
            950: '#09090b'
        },

        // 4. COLOR SCHEME MAPPING
        colorScheme: {
            light: {
                primary: {
                    color: '{primary.600}',
                    contrastColor: '#ffffff',
                    hoverColor: '{primary.700}',
                    activeColor: '{primary.800}'
                },
                highlight: {
                    background: '{primary.50}',
                    focusBackground: '{primary.100}',
                    color: '{primary.700}',
                    focusColor: '{primary.800}'
                },
                surface: {
                    background: '#ffffff',
                    ground: '{surface.50}',
                    card: '#ffffff',
                    border: '{surface.200}',
                    text: '{surface.900}',       // Main Text: Deep Teal
                    secondaryText: '{gray.600}', // NEW: Secondary text uses Gray for readability
                    detailText: '{gray.500}'     // NEW: Muted text
                }
            },
            dark: {
                primary: {
                    color: '{primary.400}',
                    contrastColor: '{surface.950}',
                    hoverColor: '{primary.300}',
                    activeColor: '{primary.200}'
                },
                highlight: {
                    background: 'rgba(5, 150, 105, 0.15)',
                    focusBackground: 'rgba(5, 150, 105, 0.25)',
                    color: 'rgba(255,255,255,0.9)',
                    focusColor: 'rgba(255,255,255,0.9)'
                },
                surface: {
                    background: '{surface.950}',
                    ground: '{surface.900}',
                    card: '{surface.900}',
                    border: '{surface.800}',
                    text: 'rgba(255,255,255,0.9)',
                    secondaryText: '{gray.400}', // NEW: Lighter gray for dark mode secondary
                    detailText: '{gray.500}'
                }
            }
        },

        // 5. WEALTH / STOCK INDICATORS
        success: {
            500: '#10b981',
            600: '#059669',
        },
        error: {
            500: '#ef4444',
            600: '#dc2626',
        },
        
       
        general: {
            black: '#000000',
            white: '#ffffff'
        },

        
        formField: {
            borderRadius: '6px',
            paddingX: '1rem',
            focusRing: {
                width: '2px',
                style: 'solid',
                color: '{primary.500}',
                offset: '1px'
            }
        }
    }
});

export default WealthWisePreset;

export const appConfig: ApplicationConfig = {

  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),
    provideRouter(routes),
    provideHttpClient(withFetch(),withInterceptors([authInterceptor])), 
    provideClientHydration(withEventReplay(),),
    // provideAnimations(),
    providePrimeNG({
            theme: {
                preset: WealthWisePreset,
                options: {
                  prefix: 'p',
                    darkModeSelector: false,
                    // cssLayer:false
                }
            }
        }),
        MessageService
  ]
};
