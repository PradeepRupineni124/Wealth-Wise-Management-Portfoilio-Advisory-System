import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes'

const WealthWisePreset = definePreset(Aura, {
    semantic: {
        // 1. PRIMARY: The "Wealth Blue" Identity
        // Based on #2c5364 (Main) and #203a43 (Deep)
        primary: {
            50: '#f0fdfa',       // Very light teal/slate
            100: '#ccfbf1',
            200: '#99f6e4',
            300: '#5eead4',
            400: '#2dd4bf',
            500: '#3e758a',      // Lighter blend for hover states
            600: '#2c5364',      // <--- YOUR COLOR (Main Brand Color)
            700: '#264856',
            800: '#203a43',      // <--- YOUR COLOR (Deep/Active State)
            900: '#1a2f38',
            950: '#0f1c21'
        },
 
        // 2. SURFACE: The Foundation
        // Light mode uses cool Slate. Dark mode uses YOUR hex codes.
        surface: {
            0: '#ffffff',
            50: '#f8fafc',       // Slate 50
            100: '#f1f5f9',      // Slate 100
            200: '#e2e8f0',      // Slate 200
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#2c5364',      // <--- Matching your lighter tone for borders/panels
            900: '#203a43',      // <--- Matching your darker tone for cards
            950: '#15262c'       // Slightly darker than #203a43 for main background
        },
 
        // 3. COLOR SCHEME MAPPING
        colorScheme: {
            light: {
                primary: {
                    color: '{primary.600}',        // Uses #2c5364
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
                    text: '{surface.900}' // Very dark slate text
                }
            },
            dark: {
                primary: {
                    color: '{primary.400}',        // Brighter teal/cyan for contrast on dark
                    contrastColor: '{surface.950}',
                    hoverColor: '{primary.300}',
                    activeColor: '{primary.200}'
                },
                highlight: {
                    background: 'rgba(44, 83, 100, 0.3)', // Glass effect using your #2c5364
                    focusBackground: 'rgba(44, 83, 100, 0.4)',
                    color: 'rgba(255,255,255,0.9)',
                    focusColor: 'rgba(255,255,255,0.9)'
                },
                surface: {
                    // This creates the gradient feel you want in Dark Mode
                    background: '{surface.950}',   // Deepest background
                    ground: '{surface.900}',       // Card Background (Your #203a43)
                    card: '{surface.900}',         // Card Background (Your #203a43)
                    border: '{surface.800}',       // Border (Your #2c5364)
                    text: 'rgba(255,255,255,0.9)'
                }
            }
        },
 
        // 4. WEALTH / STOCK INDICATORS
        // "Profit" and "Loss" colors that look good against your dark teal
        success: {
            500: '#10b981', // Emerald 500 (Vibrant Green)
            600: '#059669', // Emerald 600
        },
        error: {
            500: '#ef4444', // Red 500 (Standard Red)
            600: '#dc2626', // Red 600
        },
 
        // 5. SHAPES (Professional & Serious)
        formField: {
            borderRadius: '6px', // Slightly sharper corners for a financial "ledger" look
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



export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideClientHydration(withEventReplay(),),
    providePrimeNG({
            theme: {
                preset: WealthWisePreset,
                options: {
                    darkmode: true
                }
            }
        })
  ]
};
