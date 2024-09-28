import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterLink, NavbarComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit {
  currentUser: string = '[USER]';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    /* TODO: replace with request to get homepage data: hotels, currently signed in user, etc.
    this.apiService.getBackendRequest('get-feed')
      .subscribe(response => {
        console.log(response);
      })
    this.apiService.getBackendRequest('')
      .subscribe({
        next: (response) => {
          console.log(response);
          this.currentUser = response.name;
        },
        error: (error) => {
        } 
      })
    */
  }
}
