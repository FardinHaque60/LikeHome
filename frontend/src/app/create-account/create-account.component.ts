import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, MatProgressSpinnerModule],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss'
})
export class CreateAccountComponent {
  emailTaken: boolean = false;
  loading: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {}

  passwordMatcher: ValidatorFn = (
    form: AbstractControl,
  ): ValidationErrors | null => {
    const password = form.get('password')?.value;
    const password2 = form.get('passwordConf')?.value;

    return password === password2 ? null : {mismatch: true};
  }

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl(''),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    passwordConf: new FormControl('', Validators.required),
    phone_number: new FormControl(''),
  }, { validators: this.passwordMatcher });

  registerSubmit(): void {
    this.loading = true;
    console.log(this.registerForm.value);
    if (this.registerForm.valid) {
      this.apiService.postBackendRequest('create-account', this.registerForm.value)
        .subscribe({
          next: (response) => {
            console.log(response);
            console.log("Registration Success");
            this.loading = false;
            // TODO: update to go to confirmation code page
            this.router.navigate(['create-account/verification']);
          },
          error: (error) => {
            console.log(error);
            if (error.error.invalidEmail) {
              this.emailTaken = true;
            }
            console.log("Registration Error");

            setTimeout(() => { 
              this.emailTaken = false;
            }, 5000);
          }
      })
    }
    else {
      this.registerForm.markAllAsTouched();
      console.log("Field Error");
    }
  }
}