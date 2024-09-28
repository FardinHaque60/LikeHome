import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss'
})
export class CreateAccountComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.registerForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('',Validators.required),
      password: new FormControl('', Validators.required),
      phone: new FormControl(''),
    });
  }

  formSubmit(): void {
    console.log(this.registerForm.value);
    if (this.registerForm.valid) {
      this.apiService.postBackendRequest('create-account', this.registerForm.value)
        .subscribe({
          next: (response) => {
            console.log(response);
            console.log("Registration success");
          },
          error: (error) => {
            console.log(error);
            console.log("registration error");
          }
      })
      
    }
  }
}