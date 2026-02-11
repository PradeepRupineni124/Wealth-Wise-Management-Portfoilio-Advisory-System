import { Routes } from '@angular/router';
// import { Home } from './Home.component/home';
import { Registration } from './Authentication/registration.component/registration.component';
import { Login } from './Authentication/login.component/login.component';

import { DashboardComponent } from './DashBoard/dashboard.component/dashboard.component';
import { SidebarComponent } from './DashBoard/sidebar.component/sidebar.component';
import { LayoutComponent } from './layout.component/layout.component';
import { OverviewComponent } from './DashBoard/overview.component/overview.component';

export const routes: Routes = [
    { path: '', component: Login },
    {path:"login",component:Login},
    {path:"register",component:Registration},
    {path:"admin", component:LayoutComponent,
    children:
    [{path:"dashboard",component:DashboardComponent},
    {path:"sideBar",component:SidebarComponent},
    {path:"overview",component:OverviewComponent}
    ]
    },
    { path: '**', redirectTo: '' }
];
