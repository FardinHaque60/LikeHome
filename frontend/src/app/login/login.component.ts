import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  invalidCredentials: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {}
  
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  loginSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Login form submitted:', this.loginForm.value);
      this.apiService.postBackendRequest('login', this.loginForm.value)
        .subscribe({
          next: (response) => {
            console.log("Login Success");
            console.log(response);
            this.router.navigate(['/']);
          },
          error: (error) => {
            console.log("Login Error");
            this.invalidCredentials = true;
            console.log(error);
          }
        })
    }
    else {
      this.loginForm.markAllAsTouched();
      console.log("Field Error");
    }
  }
}
