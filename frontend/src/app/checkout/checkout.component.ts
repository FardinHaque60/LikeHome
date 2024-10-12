import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../service/api.service';
import { RouterLink } from '@angular/router';
import { FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterLink, FooterComponent, ReactiveFormsModule,CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit{

  constructor(private apiService: ApiService) { }

  paymentForm = new FormGroup({
    cardNum: new FormControl('', Validators.required),
    cardName: new FormControl('', Validators.required),
    expDate: new FormControl('', Validators.required),
    CVV: new FormControl('', Validators.required),
  });

  // TO-DO: send data from form to backend
  paymentSubmit(): void{

  }

  ngOnInit(): void {
    
  }

}