import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';

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
  // TODO modify this so it just one field and the values are in html
  sortFilter = new FormGroup({
    location: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    hotelName: new FormControl('', Validators.required),
    checkIn: new FormControl('', Validators.required),
    checkOut: new FormControl('', Validators.required),
  });

  constructor(private apiService: ApiService, private router: Router, private activatedroute: ActivatedRoute) {}

  getWatchlist(): void {
    this.apiService.getBackendRequest('get-watchlist')
    .subscribe({
      next: (data: any) => {
        console.log(data); // look in inspect element console to see what format data is in for parsing
        this.watchlistHotels = data;
      },
      error: (error: any) => {
        console.log('Watchlist Results Error')
        console.log(error);
      }
    });
  }

  // TODO backend request to sort hotels, maybe just do this browser side
  sortFilterSubmit(): void {
    this.loading = true;
    console.log('Sort Filter Submitted:', this.sortFilter.value);
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

  ngOnInit(): void {
    this.getWatchlist();
  }
}