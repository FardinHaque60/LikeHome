import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../service/api.service';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
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

  constructor(private apiService: ApiService, private router: Router) { }

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
    //moves to the top of the page when finished navigating (back&forth)
    //seems to not work with <-- back arrows
    this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
            window.scrollTo(0, 0)
        }
    });
  }

}