import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './Authentication/login.component/login.component';

import { DashboardComponent } from './DashBoard/dashboard.component/dashboard.component';
import { SidebarComponent } from './DashBoard/sidebar.component/sidebar.component';

export const routes: Routes = [
    { path: '', component: Home },
    {path:"login",component:Login},
    {path:"dashboard",component:DashboardComponent},
    {path:"sideBar",component:SidebarComponent},
    { path: '**', redirectTo: '' }
];
