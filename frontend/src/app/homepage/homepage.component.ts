import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChatbotComponent } from '../shared/chatbot/chatbot.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    RouterLink, 
    NavbarComponent, 
    FooterComponent, 
    RouterOutlet, 
    CommonModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatDatepickerModule, 
    FormsModule,
    MatProgressSpinnerModule,
    ChatbotComponent
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
  providers: [provideNativeDateAdapter()]
})
export class HomepageComponent implements OnInit {
  hasChildren: boolean = false;
  currentUser = {
    'first_name': '',
    'last_name': '',
    'email': '',
    'username': '',
  };
  hotels: Array<any> = [];
  loading: boolean = false;

  constructor(private apiService: ApiService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.subscribe(() => {
      this.hasChildren = this.activatedRoute.firstChild !== null;
    });
  }

  dateChecker: ValidatorFn = (
    form: AbstractControl,
  ): ValidationErrors | null => {
    const checkIn = form.get('check_in')?.value;
    const checkOut = form.get('check_out')?.value;
    const today = new Date();

    const isFutureCheckIn = checkIn && checkIn > today;
    const isFutureCheckOut = checkOut && checkOut > today;
    const isCheckInBeforeCheckOut = checkIn && checkOut && checkIn < checkOut;

    return isFutureCheckIn && isFutureCheckOut && isCheckInBeforeCheckOut ? null : { invalidDate: true };
  }

  hotelSearch = new FormGroup({
    location: new FormControl('', Validators.required),
    check_in: new FormControl<Date | null>(null),
    check_out: new FormControl<Date | null>(null),
    adults: new FormControl('', Validators.required),
    children: new FormControl('', Validators.required),
    radius: new FormControl('20', Validators.required),
    min_rate: new FormControl('0', Validators.required),
    max_rate: new FormControl('5000', Validators.required),
  }, { validators: this.dateChecker });

  hotelSearchSubmit(): void {
    if (this.hotelSearch.invalid) {
      console.log("Field Error");
      this.hotelSearch.markAllAsTouched();
      alert("Invalid search fields.");
      return;
    }
    this.loading = true;
    console.log('Hotel search form submitted:', this.hotelSearch.value);
    this.apiService.postBackendRequest('search', this.hotelSearch.value)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.loading = false;
          this.router.navigate(['/search-results']);
        },
        error: (error) => {
          console.log(error);
          this.loading = false;
          this.router.navigate(['/search-results']);
        }
      });
  }
  
  getToUSDRate(originalCurrency: string): Observable<any> { //returns rate from originalCurrency to USD
    let currencyOptions = {
      'fromCurrency': originalCurrency,
      'toCurrency': 'usd',
    }
    // returns the rate for fromCurrency to toCurrency
    return this.apiService.postBackendRequest('currency-convert', currencyOptions);
  }

  get_featured_hotels(): void {
    this.apiService.getBackendRequest('get-featured-hotels')
      .subscribe({
        next: (response) => {
          console.log(response['hotels']);
          this.hotels = response['hotels'];
          // convert minRate for display to usd
          for (const hotel of this.hotels) {
            this.getToUSDRate(hotel['currency'])
              .subscribe({
                next: (data: any) => {
                  hotel['convertedMinRate'] = +((hotel['minRate'] * data['rate']).toFixed(2));
                },
                error: (error: any) => {
                  console.log(error);
                }
              });
          }
        },
        error: (error) => { 
          console.log(error);
        }
      });
  }

  openHotel(i: number): void {
    this.router.navigate(['/hotel-details'], { queryParams: { 
      checkIn: "2024-12-03", 
      checkOut: "2024-12-05", 
      details: JSON.stringify(this.hotels[i]) 
      } 
    });
  }

  replaceImage(event: any) {
    event.target.src = 'assets/images/nexus_logo.png';
  }

  ngOnInit(): void {
    this.get_featured_hotels();
    this.apiService.getBackendRequest('get-session')
      .subscribe({
        next: (response) => {
          console.log(response);
          this.currentUser = response;
        },
        error: (error) => { 
          console.log(error);
        }
      });
  }
}
