import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
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
