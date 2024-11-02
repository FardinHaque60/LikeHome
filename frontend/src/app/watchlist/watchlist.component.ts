import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink,ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { ApiService } from '../service/api.service';


@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.scss'
})
export class WatchlistComponent implements OnInit {

  watchlistHotels: Array<any> = [];

  constructor(private apiService: ApiService, private router: Router, private activatedroute: ActivatedRoute) {
    this.router.events.subscribe(() => {

    });
  }

  ngOnInit(): void {
    this.apiService.getBackendRequest('get-watchlist')
    .subscribe({
      next: (data: any) => {
        console.log(data); // look in inspect element console to see what format data is in for parsing
        this.watchlistHotels = data;
        console.log(this.watchlistHotels[0].images);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }


  

}