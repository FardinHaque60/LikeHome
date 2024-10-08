import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent, RouterOutlet, CommonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit {
  currentUser: string = '[USER]';
  hasChildren: boolean = false;

  constructor(private apiService: ApiService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.subscribe(() => {
      this.hasChildren = this.activatedRoute.firstChild !== null;
    });
  }

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
