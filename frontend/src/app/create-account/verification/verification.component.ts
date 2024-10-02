import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './verification.component.html',
  styleUrl: './verification.component.scss'
})
export class VerificationComponent {
  invalidCode: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {}

  verifyForm = new FormGroup({
    code: new FormControl('', Validators.required),
  });

  codeSubmit(): void {
    console.log(this.verifyForm.value);
    if (this.verifyForm.valid) {
      this.apiService.postBackendRequest('verify-code', this.verifyForm.value)
        .subscribe({
          next: (response) => {
            console.log(response);
            console.log("Verification Success");
            this.router.navigate(['/']);
          },
          error: (error) => {
            this.invalidCode = true;
            console.log(error);
            console.log("Verification Error");

            setTimeout(() => {
              this.invalidCode = false;
            }, 5000);
          }
        });
    }
    else {
      this.verifyForm.markAllAsTouched();
      console.log("Field Error");
    }
  }
}
