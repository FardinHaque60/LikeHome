import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink,ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent, 
            MatProgressSpinnerModule, CommonModule,],
  templateUrl:'./account-details.component.html',
  styleUrl: './account-details.component.scss'
})
export class AccountDetailsComponent implements OnInit {
  constructor(private apiService: ApiService, private router: Router, private activatedroute: ActivatedRoute) {
    this.router.events.subscribe(() => {

    });
  }

  currentUser = {
    'first_name': '',
    'last_name': '',
    'email': '',
    'username': '',
  };

  bookedRooms: Array<any> = [];
  fromAccount: boolean = true;


  
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
      })

      this.apiService.getBackendRequest('get-reservations')
      .subscribe({
        next: (response) => {
          console.log(response); // look in inspect element console to see what format data is in for parsing
          this.bookedRooms = response['reservations'];
          console.log(this.bookedRooms);
        },
        error: (error) => { 
          console.log(error);
        }
      });
  }

  openHotel(i: number): void {
    this.router.navigate(['/hotel-details'], { queryParams: { 
      accountDetails: JSON.stringify(this.bookedRooms[i]),
      //sends the statement that this is from the account-details page
      fromAccount: this.fromAccount,
      } 
    });
  }

  replaceImage(event: any) {
    event.target.src = 'assets/images/nexus_logo.png';
  }
}