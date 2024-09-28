import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    //TODO: abstract HTTP requests into service layer
    this.http.get<ApiResponse[]>('http://localhost:8000/get/')
      .subscribe(response => {
        console.log(response);
        this.title = response[0].name;
      })
  }
}

interface ApiResponse {
  name: string;
}
