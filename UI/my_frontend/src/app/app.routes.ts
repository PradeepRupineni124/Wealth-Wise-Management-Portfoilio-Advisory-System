import { Routes } from '@angular/router';
import { Home } from './home.component/home.component';


export const routes: Routes = [
    { path: '', component:Home,pathMatch:"full"},
    { path: '**', redirectTo: '' }
];
