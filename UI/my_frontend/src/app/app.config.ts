import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { routes } from './app.routes';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';


const WealthWisePreset = definePreset(Aura, {
    semantic: {
       
        primary: {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981',
            600: '#059669',   
            700: '#047857',
            800: '#065f46',
            900: '#064e3b',
            950: '#022c22'
        },

        
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
                    text: '{surface.900}'
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
                    background: 'rgba(5,150,105,0.15)',
                    focusBackground: 'rgba(5,150,105,0.25)',
                    color: 'rgba(255,255,255,0.9)',
                    focusColor: 'rgba(255,255,255,0.9)'
                },
                surface: {
                    background: '{surface.950}',
                    ground: '{surface.900}',
                    card: '{surface.900}',
                    border: '{surface.800}',
                    text: 'rgba(255,255,255,0.9)'
                }
            }
        },

        
        success: {
            500: '#10b981',
            600: '#059669'
        },
        error: {
            500: '#ef4444',
            600: '#dc2626'
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



export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        provideClientHydration(withEventReplay()),
        providePrimeNG({
            theme: {
                preset: WealthWisePreset,
                // options: {
                //     darkmode: true
                // }
            }
        })
    ]
};