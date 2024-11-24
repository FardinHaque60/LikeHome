import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent, 
            MatDatepickerModule, MatProgressSpinnerModule, ReactiveFormsModule],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.scss'
})
export class WatchlistComponent implements OnInit {
  watchlistHotels: Array<any> = [];
  loading: boolean = false;

  options = [
    { label: 'City', value: 'city' },
    { label: 'Hotel Name', value: 'hotel_name' },
    { label: 'Price', value: 'min_rate' },
    { label: 'Check In', value: 'check_in' },
    { label: 'Check Out', value: 'check_out' },
  ];

  sortFilter = new FormGroup({
    selectedChoice: new FormControl('', Validators.required),
  });

  constructor(private apiService: ApiService, private router: Router, private activatedroute: ActivatedRoute) {}

  getToUSDRate(originalCurrency: string): Observable<any> { //returns rate from originalCurrency to USD
    let currencyOptions = {
      'fromCurrency': originalCurrency,
      'toCurrency': 'usd',
    }
    // returns the rate for fromCurrency to toCurrency
    return this.apiService.postBackendRequest('currency-convert', currencyOptions);
  }

  getWatchlist(): void {
    this.apiService.getBackendRequest('get-watchlist')
    .subscribe({
      next: (data: any) => {
        console.log(data); // look in inspect element console to see what format data is in for parsing
        this.watchlistHotels = data;
        for (const hotel of this.watchlistHotels) {
          this.getToUSDRate(hotel['currency'])
            .subscribe({
              next: (data: any) => {
                hotel['convertedMinRate'] = +((hotel['min_rate'] * data['rate']).toFixed(2));
                hotel['convertedMaxRate'] = +((hotel['max_rate'] * data['rate']).toFixed(2));
              },
              error: (error: any) => {
                console.log(error);
              }
            });
        }
      },
      error: (error: any) => {
        console.log('Watchlist Results Error')
        console.log(error);
      }
    });
  }

  sortFilterSubmit(): void {
    this.loading = true;
    console.log('Sort Filter Submit with choice: ', this.sortFilter.value.selectedChoice);
    console.log('Watchlist Hotels: ', this.watchlistHotels);
    let param = this.sortFilter.value.selectedChoice;
    if (param === 'city' || param === 'hotel_name') { // sorting by a string field
      this.watchlistHotels.sort((a, b) => {
        return a[param].localeCompare(b[param]);
      });
    } else if (param === 'min_rate') { // sorting by a number field
      this.watchlistHotels.sort((a, b) => { return a[param] - b[param]; });
    } else if (param === 'check_in' || param === 'check_out') { // sorting by a date field
      this.watchlistHotels.sort((a, b) => {
        return new Date(a[param]).getTime() - new Date(b[param]).getTime();
      });
    }
    this.loading = false;
  }

  seeHotelDetails(index: number): void {
    let selectedHotel = this.watchlistHotels[index];
    selectedHotel['minRate'] = selectedHotel['min_rate'];
    selectedHotel['maxRate'] = selectedHotel['max_rate'];
    selectedHotel['name'] = selectedHotel['hotel_name'];
    this.router.navigate(['/hotel-details'], { 
      queryParams: 
        { 
          checkIn: selectedHotel['check_in'], 
          checkOut: selectedHotel['check_out'], 
          details: JSON.stringify(selectedHotel) 
        } 
    });
  }

  removeFromWatchlist(index: number): void {
    this.loading = true;
    let selectedHotel = this.watchlistHotels[index];
    this.apiService.postBackendRequest('remove-from-watchlist', { "rooms": selectedHotel['rooms']})
    .subscribe({
      next: (data: any) => {
        console.log(data);
        this.watchlistHotels.splice(index, 1);
        this.loading = false;
      },
      error: (error: any) => {
        console.log('Error removing from watchlist');
        console.log(error);
        this.loading = false;
      }
    });
  }

  replaceImage(event: any) {
    event.target.src = 'assets/images/nexus_logo.png';
  }

  ngOnInit(): void {
    this.getWatchlist();
  }
}