import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { HomepageComponent } from './homepage/homepage.component';
import { VerificationComponent } from './create-account/verification/verification.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { HotelDetailsComponent } from './hotel-details/hotel-details.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';

export const routes: Routes = [
    { 
        path: '', 
        component: HomepageComponent,
        children: [
            {
                path: 'about-us',
                component: AboutUsComponent
            },
            {
                path: 'search-results',
                component: SearchResultsComponent
            },
            {
                path: 'hotel-details',
                component: HotelDetailsComponent,
            },
        ]
    },
    { path: 'login', component: LoginComponent }, // TODO: add protection, if user signed in then go to homepage
    { path: 'create-account', component: CreateAccountComponent}, // TODO: add protection, if user signed in then go to homepage
    { path: 'create-account/verification', component: VerificationComponent}, // TODO: add protection to this route, only accessed after creating account
    { path: 'checkout', component: CheckoutComponent},
    { path: 'confirmation', component: ConfirmationComponent},
];
