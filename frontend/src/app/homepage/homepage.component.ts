import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit {
  testText = 'frontend';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getBackendRequest('get')
      .subscribe(response => {
        // expect to receive a list of all names entered to the temp table
        console.log(response);
        this.testText = response[0].name;
      })
  }
}
