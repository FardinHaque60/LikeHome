import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterLink, NavbarComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent implements OnInit{

  constructor(private apiService: ApiService) { }


  ngOnInit(): void {
    
  }

}