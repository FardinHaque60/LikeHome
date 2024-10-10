import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  signedIn: boolean = false;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
      this.apiService.getBackendRequest('get-session')
        .subscribe({
          next: (response) => {
            this.signedIn = true;
            console.log(response);
          },
          error: (error) => {
            this.signedIn = false;
            console.log(error); 
          }
        });
  }
}