import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  loginSubmit(): void {
    // TODO make backend request to verify account
    if (this.loginForm.valid) {
      console.log('Login form submitted:', this.loginForm.value);
      this.apiService.postBackendRequest('login', this.loginForm.value)
        .subscribe({
          next: (response) => {
            console.log(response);
            this.router.navigate(['']);
          },
          error: (error) => {
            console.log(error);
          }
        })
    }
    else {
      this.loginForm.markAllAsTouched();
    }
  }
}
