import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, ReactiveFormsModule, MatDatepickerModule],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent implements OnInit {
  searchResults: Array<any> = [];
  loading: boolean = false;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router) {}

  dateChecker: ValidatorFn = (
    form: AbstractControl,
  ): ValidationErrors | null => {
    const checkIn = form.get('check_in')?.value;
    const checkOut = form.get('check_out')?.value;
    const today = new Date();

    const isFutureCheckIn = checkIn && (checkIn > today);
    const isFutureCheckOut = checkOut && (checkOut > today);
    const isCheckInBeforeCheckOut = (checkIn && checkOut) && (checkIn < checkOut);

    console.log('isFutureCheckIn:', isFutureCheckIn);
    console.log('isFutureCheckOut:', isFutureCheckOut);
    console.log('isCheckInBeforeCheckOut:', isCheckInBeforeCheckOut);

    return isFutureCheckIn && isFutureCheckOut && isCheckInBeforeCheckOut ? null : { invalidDate: true };
  }

  searchFilter = new FormGroup({
    location: new FormControl('', Validators.required),
    check_in: new FormControl<Date | null>(null),
    check_out: new FormControl<Date | null>(null),
    adults: new FormControl('', Validators.required),
    children: new FormControl('', Validators.required),
    radius: new FormControl(20, Validators.required),
    min_rate: new FormControl(0, Validators.required),
    max_rate: new FormControl(5000, Validators.required)
  }, { validators: this.dateChecker });

  options = [
    { label: 'City', value: 'city' },
    { label: 'Hotel Name', value: 'name' },
    { label: 'Price', value: 'minRate' },
  ];

  sortFilter = new FormGroup({
    selectedChoice: new FormControl('', Validators.required),
  });

  sortFilterSubmit(): void {
    console.log('Sort Filter Submit with choice: ', this.sortFilter.value.selectedChoice);
    let param = this.sortFilter.value.selectedChoice;
    if (param === 'city' || param === 'name') { // sorting by a string field
      this.searchResults.sort((a, b) => {
        return a[param].localeCompare(b[param]);
      });
    } else if (param === 'minRate') { // sorting by a number field
      this.searchResults.sort((a, b) => { return a[param] - b[param]; });
    }
  }

  formatDate(date: Date | string | null | undefined): string {
    if (!date) return '';

    const dateObj = typeof date === 'string' ? new Date(date) : date;
  
    if (isNaN(dateObj.getTime())) {
      return '';
    }
  
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); 
    const day = String(dateObj.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }

  // TODO will cause unexpected behavior if user enters new date but does not hit search, better solution is to change backend response
  openHotel(i: number): void {
    this.router.navigate(['/hotel-details'], { 
      queryParams: 
        { 
          checkIn: this.formatDate(this.searchFilter.get('check_in')?.value), 
          checkOut: this.formatDate(this.searchFilter.get('check_out')?.value), 
          details: JSON.stringify(this.searchResults[i]) 
        } 
    });
  }

  // used for formatting when modifying the date
  selectionFormatDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    // create a date in UTC, then get the local equivalent
    return new Date(Date.UTC(year, month-1, day+1));
  }

  getToUSDRate(originalCurrency: string): Observable<any> { //returns rate from originalCurrency to USD
    let currencyOptions = {
      'fromCurrency': originalCurrency,
      'toCurrency': 'usd',
    }
    // returns the rate for fromCurrency to toCurrency
    return this.apiService.postBackendRequest('currency-convert', currencyOptions);
  }

  getResults(): void {
    this.apiService.getBackendRequest('get-search-result')
      .subscribe({
        next: (response) => {
          console.log("Search Result Loaded Success");
          console.log(response['query']);
          console.log(response['hotels']);
          // set results to be reflected in frontend
          this.searchResults = response['hotels'];
          this.searchFilter.patchValue(response['query']); // set search filter placeholders from search query
          this.searchFilter.patchValue({ 
            check_in: this.selectionFormatDate(response['query']['check_in'].substring(0, 10)),
            check_out: this.selectionFormatDate(response['query']['check_out'].substring(0, 10))
          }); // set check_in date
          for (const hotel of this.searchResults) {
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
          this.loading = false;
        },
        error: (error) => {
          console.log("Search Result Error");
          console.log(error);
          this.loading = false;
        }
      })
  }

  // invoked when search is called from search page itself
  searchFilterSubmit(): void {
    if (this.searchFilter.invalid) {
      console.log(this.searchFilter.value);
      console.log(this.searchFilter.errors);
      console.log('Search Filter Invalid');
      alert('Invalid search filter fields');
      return;
    }
    this.loading = true;
    console.log('Search Filter Submitted:', this.searchFilter.value);
    this.apiService.postBackendRequest('search', this.searchFilter.value)
        .subscribe({
          next: (response) => {
            console.log("Search Request Ack Success");
            console.log(response);
            this.getResults();
          },
          error: (error) => {
            console.log("Search Error");
            console.log(error);
            this.getResults();
            this.loading = false;
          }
        })
  }

  replaceImage(event: any) {
    event.target.src = 'assets/images/nexus_logo.png';
  }

  ngOnInit(): void {
    // init page with search results from backend cache
    this.getResults();
    console.log(this.searchResults);
  }
}
