import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../service/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss'
})
export class CreateAccountComponent {
  emailTaken: boolean = false;

  constructor(private apiService: ApiService) {}

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

  formSubmit(): void {
    console.log(this.registerForm.value);
    if (this.registerForm.valid) {
      this.apiService.postBackendRequest('create-account', this.registerForm.value)
        .subscribe({
          next: (response) => {
            console.log(response);
            console.log("Registration Success");
          },
          error: (error) => {
            console.log(error);
            if (error.email) {
              this.emailTaken = false;
            }
            console.log("Registration Error");
          }
      })
    }
    else {
      this.registerForm.markAllAsTouched();
      console.log("Field Error");
    }
  }
}