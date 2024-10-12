import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
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

  constructor(private apiService: ApiService, private router: Router) { }

  logout(): void {
    this.apiService.postBackendRequest('logout', {})
      .subscribe({
        next: (response) => {
          console.log(response);
          this.signedIn = false;
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.log(error);
        }
      });
  }

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