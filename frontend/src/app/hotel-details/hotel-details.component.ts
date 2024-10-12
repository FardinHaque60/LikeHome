import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-hotel-details',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './hotel-details.component.html',
  styleUrl: './hotel-details.component.scss'
})
export class HotelDetailsComponent implements OnInit{

  constructor(private apiService: ApiService, private router: Router) { }


  ngOnInit(): void {
        //moves to the top of the page when finished navigating (back&forth)
        //seems to not work with <-- back arrows
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                window.scrollTo(0, 0)
            }
        });
  }

}