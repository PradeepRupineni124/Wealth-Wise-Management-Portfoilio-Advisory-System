import { Routes } from '@angular/router';
import { Login } from './Authentication/login.component/login.component';

import { DashboardComponent } from './DashBoard/dashboard.component/dashboard.component';
import { SidebarComponent } from './DashBoard/sidebar.component/sidebar.component';
import { LayoutComponent } from './layout.component/layout.component';

export const routes: Routes = [
    { path: '', component: Login },
    {path:"login",component:Login},
    {path:"admin", component:LayoutComponent,
    children:
    [{path:"dashboard",component:DashboardComponent},
    {path:"sideBar",component:SidebarComponent}]},
    { path: '**', redirectTo: '' }
];
