import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent, RouterOutlet, CommonModule, ReactiveFormsModule, MatFormFieldModule, MatDatepickerModule, FormsModule],
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

  constructor(private apiService: ApiService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.subscribe(() => {
      this.hasChildren = this.activatedRoute.firstChild !== null;
    });
  }

  hotelSearch = new FormGroup({
    location: new FormControl('', Validators.required),
    check_in: new FormControl<Date | null>(null),
    check_out: new FormControl<Date | null>(null),
    rooms: new FormControl('', Validators.required),
    adults: new FormControl('', Validators.required),
    children: new FormControl('', Validators.required),
    radius: new FormControl('20', Validators.required),
    min_rate: new FormControl('0', Validators.required),
    max_rate: new FormControl('5000', Validators.required),
  });

  hotelSearchSubmit(): void {
    if (this.hotelSearch.valid) {
      console.log('Hotel search form submitted:', this.hotelSearch.value);
      this.router.navigate(['/search-results'], { queryParams: this.hotelSearch.value });
    }
    else {
      this.hotelSearch.markAllAsTouched();
      console.log("Field Error");
    }
  }

  get_featured_hotels(): void {
    this.apiService.getBackendRequest('get-featured-hotels')
      .subscribe({
        next: (response) => {
          console.log(response['hotels']);
          this.hotels = response['hotels'];
        },
        error: (error) => { 
          console.log(error);
        }
      });
  }

  openHotel(i: number): void {
    this.router.navigate(['/hotel-details'], { queryParams: { 
      checkIn: "2024-10-15", 
      checkOut: "2024-10-18", 
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
