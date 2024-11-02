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
  searchFilter = new FormGroup({
    location: new FormControl('', Validators.required),
    check_in: new FormControl<Date | null>(null),
    check_out: new FormControl<Date | null>(null),
    rooms: new FormControl('', Validators.required),
    adults: new FormControl('', Validators.required),
    children: new FormControl('', Validators.required),
    radius: new FormControl('', Validators.required),
    min_rate: new FormControl('', Validators.required),
    max_rate: new FormControl('', Validators.required)
  });

  constructor(private apiService: ApiService, private router: Router, private activatedroute: ActivatedRoute) {
    this.router.events.subscribe(() => {

    });
  }

  getResults(): void {
    this.apiService.getBackendRequest('get-watchlist')
    .subscribe({
      next: (data: any) => {
        console.log(data); // look in inspect element console to see what format data is in for parsing
        this.watchlistHotels = data;
        this.loading = false;
        console.log(this.watchlistHotels[0].images);
      },
      error: (error: any) => {
        console.log("Search Result Error");
        console.log(error);
        this.loading = false;
      }
    });
  }

    // invoked when search is called from search page itself
    searchFilterSubmit(): void {
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
              this.loading = false;
            }
          })
    }

  ngOnInit(): void {
    this.getResults();
  }


  

}