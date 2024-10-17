import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent, MatProgressSpinnerModule],
  templateUrl:'./account-details.component.html',
  styleUrl: './account-details.component.scss'
})
export class AccountDetailsComponent implements OnInit {
  constructor(private apiService: ApiService, private router: Router) {
    this.router.events.subscribe(() => {
      
    });
  }

  currentUser = {
    'first_name': '',
    'last_name': '',
    'email': '',
    'username': '',
  };

  
  ngOnInit(): void {
    /*
    this.apiService.getBackendRequest('get-session')
      .subscribe({
        next: (response) => {
          console.log(response);
          this.currentUser = response;
        },
        error: (error) => { 
          console.log(error);
        }
      });*/
  }
}