import { Routes } from '@angular/router';
import { ClientRegistrationComponent } from './client-registration.component/client-registration.component';

export const routes: Routes = [
    { path: '', component: ClientRegistrationComponent,pathMatch:'full'},
    { path: '**', redirectTo: '' }
];
