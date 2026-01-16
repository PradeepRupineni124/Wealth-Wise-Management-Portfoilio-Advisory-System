import { Routes } from '@angular/router';
import { Login } from './Authentication/login.component/login.component';

import { SidebarComponent } from './DashBoard/sidebar.component/sidebar.component';
import { LayoutComponent } from './layout.component/layout.component';
import { ProfileComponent } from './DashBoard/Profile/profile.component/profile.component';
import { HomeComponent } from './home.component/home.component';
import { PortfolioComponent } from './DashBoard/Portfolio/portfolio.component/portfolio.component';

export const routes: Routes = [
    {path:'',component:HomeComponent,pathMatch:'full'},
    {path:"login",component:Login},
    {path:"admin", component:LayoutComponent,
    children:
    [{path:"profile",component:ProfileComponent},
    {path:"portfolio",component:PortfolioComponent},
    {path:"sideBar",component:SidebarComponent}]},
    { path: '**', redirectTo: '/login' }
];
