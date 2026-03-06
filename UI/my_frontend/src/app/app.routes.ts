import { Routes } from '@angular/router';
import { Login } from './Authentication/login.component/login.component';

import { SidebarComponent } from './DashBoard/sidebar.component/sidebar.component';
import { LayoutComponent } from './layout.component/layout.component';
import { ProfileComponent } from './DashBoard/Profile/profile.component/profile.component';
import { HomeComponent } from './home.component/home.component';
import { PortfolioComponent } from './DashBoard/Portfolio/portfolio.component/portfolio.component';
import { AnalyticsComponent } from './DashBoard/Analytics-segment/analytics.component/analytics.component';
import { AdvisoryComponent } from './DashBoard/advisory.component/advisory.component';

import { ForgotPasswordComponent } from './Authentication/forgot-password.component/forgot-password.component';
import { EmailVerificationComponent } from './Authentication/forgot-password.component/email-verification.component/email-verification.component';
import { ResetPasswordComponent } from './Authentication/forgot-password.component/reset-password.component/reset-password.component';
import { Registration } from './Authentication/registration.component/registration.component';
import { OverviewComponent } from './DashBoard/overview.component/overview.component';
import { authGuard } from './auth-guard';
// FIX: Import the new recovery guard
import { recoveryGuard } from './guards/recovery-guard';
import { ComplianceComponent } from './DashBoard/Compilance/compilance.component/compilance.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: "login", component: Login },
    { path: "register", component: Registration },

    // --- Forgot Password Flow ---
    { path: "forgot-password", component: ForgotPasswordComponent },

    {
        path: "email-verification",
        component: EmailVerificationComponent,
        canActivate: [recoveryGuard] // <-- Protected: Kicks user back if no email found
    },

    {
        path: "reset-password",
        component: ResetPasswordComponent,
        canActivate: [recoveryGuard] // <-- Protected: Kicks user back if no email found
    },
    // ---------------------------

    {
        path: "admin",
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: "overview", component: OverviewComponent },
            { path: "profile", component: ProfileComponent },
            { path: "portfolio", component: PortfolioComponent },
            { path: "sideBar", component: SidebarComponent },
            { path: 'analytics', component: AnalyticsComponent },
            { path: 'advisory', component: AdvisoryComponent },
            { path: 'compliance', component: ComplianceComponent }
        ]
    },
    { path: '**', redirectTo: '/login' }
];