import { Routes } from '@angular/router';
import { Home } from './Home.component/home';
import { Login } from './login/login';
import { Registration } from './registration/registration';

export const routes: Routes = [
    { path: '', component: Home },
    {path:"login",component:Login},
    {path:"register",component:Registration},
    { path: '**', redirectTo: '' }
];
