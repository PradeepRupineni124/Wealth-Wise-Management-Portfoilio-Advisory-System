import { Routes } from '@angular/router';
import { Login } from './Authentication/login.component/login.component';

import { SidebarComponent } from './DashBoard/sidebar.component/sidebar.component';
import { LayoutComponent } from './layout.component/layout.component';
import { ProfileComponent } from './DashBoard/Profile/profile.component/profile.component';

export const routes: Routes = [
    {path:"login",component:Login},
    {path:"admin", component:LayoutComponent,
    children:
    [{path:"profile",component:ProfileComponent},
    {path:"sideBar",component:SidebarComponent}]},
    { path: '**', redirectTo: '/login' }
];
