import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent, RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit {
  hasChildren: boolean = false;
  currentUser = {
    'first_name': '',
    'last_name': '',
    'email': '',
    'username': '',
  };

  constructor(private apiService: ApiService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.subscribe(() => {
      this.hasChildren = this.activatedRoute.firstChild !== null;
    });
  }

  hotelSearch = new FormGroup({
    location: new FormControl('', Validators.required),
    check_in: new FormControl('', Validators.required),
    check_out: new FormControl('', Validators.required),
    rooms: new FormControl('', Validators.required),
    adults: new FormControl('', Validators.required),
  });

  hotelSearchSubmit(): void {
    if (this.hotelSearch.valid) {
      console.log('Hotel search form submitted:', this.hotelSearch.value);
      this.router.navigate(['/search-results'], { queryParams: this.hotelSearch.value });
      this.apiService.postBackendRequest('search', this.hotelSearch.value)
        .subscribe({
          next: (response) => {
            console.log("Search Success");
            console.log(response);
          },
          error: (error) => {
            console.log("Search Error");
            console.log(error);
          }
        })
    }
    else {
      this.hotelSearch.markAllAsTouched();
      console.log("Field Error");
    }
  }

  ngOnInit(): void {
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
