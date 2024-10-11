import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../service/api.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent implements OnInit {
  searchResults: Array<any> = [];
  searchParams: any;
  loading: boolean = true;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  search(params: any): void {
    this.apiService.postBackendRequest('search', params)
        .subscribe({
          next: (response) => {
            console.log("Search Success");
            console.log(response['status']);
            console.log(response['hotels']);
            this.searchResults = response['hotels'];
            this.loading = false;
          },
          error: (error) => {
            console.log("Search Error");
            console.log(error);
          }
        })
  }

  replaceImage(event: any) {
    event.target.src = 'assets/images/nexus_logo.png';
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchParams = params;
      console.log('Search Results:', this.searchParams);
    });

    this.search(this.searchParams);
  }
}
