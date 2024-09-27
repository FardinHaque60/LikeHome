import { ApiService } from '../service/api.service';
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
  testText = 'frontend';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getRequest('get')
      .subscribe(response => {
        // expect to receive a list of all names entered to the temp table
        console.log(response);
        this.testText = response[0].name;
      })
  }
}
