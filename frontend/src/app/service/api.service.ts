import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Service for making API GET and POST requests
 * components can import ApiService and use its getRequest and postRequest methods
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl: string = "http://localhost:8000/";

  constructor(private http: HttpClient) { }

  getBackendRequest(endpoint: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${endpoint}`);
  }

  postBackendRequest(endpoint: string, payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${endpoint}`, payload);
  }

  getRegRequest(endpoint: string): Observable<any> {
    return this.http.get<any>(endpoint);
  }

  postRegRequest(endpoint: string, payload: any): Observable<any> {
    return this.http.post<any>(endpoint, payload);
  }
}
