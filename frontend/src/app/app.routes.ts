import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { HomepageComponent } from './homepage/homepage.component';
import { VerificationComponent } from './create-account/verification/verification.component';

export const routes: Routes = [
    { path: '', component: HomepageComponent},
    { path: 'login', component: LoginComponent }, // TODO: add protection, if user signed in then go to homepage
    { path: 'create-account', component: CreateAccountComponent}, // TODO: add protection, if user signed in then go to homepage
    { path: 'create-account/verification', component: VerificationComponent}, // TODO: add protection to this route, only accessed after creating account
];
