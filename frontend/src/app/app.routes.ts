import { Routes } from '@angular/router';
import { AppComponent } from './app.component'
import { LoginComponent } from './login/app.logincomponent'
import { HomeComponent } from './home/home.component';
export const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: '',
        redirectTo: '/home', pathMatch: 'full',
    },
];
