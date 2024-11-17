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
import { AccountDetailsComponent } from './account-details/account-details.component';
import { WatchlistComponent } from './watchlist/watchlist.component';

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
            {
                path: 'account-details',
                component: AccountDetailsComponent,
            },
            {
                path: 'watchlist',
                component: WatchlistComponent,
            },
        ]
    },
    { path: 'login', component: LoginComponent },
    { path: 'create-account', component: CreateAccountComponent}, 
    { path: 'create-account/verification', component: VerificationComponent}, 
    { path: 'checkout', component: CheckoutComponent}, // page that appears after user clicks "checkout" in hotel details page
    { path: 'confirmation', component: ConfirmationComponent}, // page that appears when user successfully books a room
];
