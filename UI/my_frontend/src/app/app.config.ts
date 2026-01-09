import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';
import { definePreset } from '@primeuix/themes';
// import Aura from '@primeuix/themes/aura';

const WealthWisePreset = definePreset(Aura, {
   semantic: {
    // 1. PRIMARY: Emerald (Wealth/Growth Green)
    primary: {
        50: '#ecfdf5',
        100: '#d1fae5',
        200: '#a7f3d0',
        300: '#6ee7b7',
        400: '#34d399',
        500: '#10b981',      // Standard Emerald
        600: '#059669',      // <--- MAIN BRAND COLOR
        700: '#047857',
        800: '#065f46',      // <--- DEEP/ACTIVE STATE
        900: '#064e3b',
        950: '#022c22'
    },

    // 2. SURFACE: Teal (Sophisticated Blue-Green foundation)
    surface: {
        0: '#ffffff',
        50: '#f0fdfa',       // Teal 50
        100: '#ccfbf1',
        200: '#99f6e4',      // Borders in Light Mode
        300: '#5eead4',
        400: '#2dd4bf',
        500: '#14b8a6',
        600: '#0d9488',
        700: '#0f766e',
        800: '#115e59',      // Dark Mode Borders
        900: '#134e4a',      // Dark Mode Cards
        950: '#042f2e'       // Dark Mode Main Background
    },

    // 3. COLOR SCHEME MAPPING
    colorScheme: {
        light: {
            primary: {
                color: '{primary.600}',        // Uses Emerald 600
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
                border: '{surface.200}',       // Teal 200
                text: '{surface.900}'          // Deep Teal Text
            }
        },
        dark: {
            primary: {
                color: '{primary.400}',        // Brighter Emerald for dark mode contrast
                contrastColor: '{surface.950}',
                hoverColor: '{primary.300}',
                activeColor: '{primary.200}'
            },
            highlight: {
                // Updated glass effect to match Emerald Green
                background: 'rgba(5, 150, 105, 0.15)', 
                focusBackground: 'rgba(5, 150, 105, 0.25)',
                color: 'rgba(255,255,255,0.9)',
                focusColor: 'rgba(255,255,255,0.9)'
            },
            surface: {
                background: '{surface.950}',   // Deep Teal (#042f2e)
                ground: '{surface.900}',       // Teal Card (#134e4a)
                card: '{surface.900}',         
                border: '{surface.800}',       // Teal Border (#115e59)
                text: 'rgba(255,255,255,0.9)'
            }
        }
    },

    // 4. WEALTH / STOCK INDICATORS
    // Note: Since Primary is now Emerald, Success is identical to Primary. 
    // You might consider changing Success to a Blue or leaving it as is.
    success: {
        500: '#10b981', // Emerald 500
        600: '#059669', // Emerald 600
    },
    error: {
        500: '#ef4444', // Red 500
        600: '#dc2626', // Red 600
    },

    // 5. SHAPES
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
// import { provideAnimations } from '@angular/platform-browser/animations';
export const appConfig: ApplicationConfig = {

  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideClientHydration(withEventReplay(),),
    // provideAnimations(),
    providePrimeNG({
            theme: {
                preset: WealthWisePreset,
                options: {
                  prefix: 'p',
                    darkModeSelector: '.my-app-dark',
                    // cssLayer:false
                }
            }
        }),
        MessageService
  ]
};
